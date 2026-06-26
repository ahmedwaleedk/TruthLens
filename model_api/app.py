import os
import sys
from typing import List, Optional, Tuple
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import torch
from PIL import Image
import torchvision.transforms as transforms
from transformers import AutoTokenizer

from model_arch import MultiModalModel

app = FastAPI(title="TruthLens Multimodal Prediction Service")

# Paths
MODEL_API_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(MODEL_API_DIR, ".."))
BACKEND_DIR = os.path.join(PROJECT_ROOT, "backend")
BACKEND_UPLOADS_DIR = os.path.join(BACKEND_DIR, "uploads")

# Constants
MODEL_PATH = os.path.join(MODEL_API_DIR, "models", "best_model_subset_5pct.pt")
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Training label convention: class index 0 = Fake, class index 1 = Real
CLASS_LABELS = {0: "Fake", 1: "Real"}

# Global instances loaded on startup
model = None
tokenizer = None

image_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

class PredictRequest(BaseModel):
    text: str = ""
    url: str = ""
    image_path: str = ""


def resolve_image_path(image_path: str) -> Tuple[Optional[str], List[str]]:
    """Resolve a backend-relative image path to an absolute file path."""
    normalized = image_path.strip().replace("\\", "/")
    if not normalized:
        return None, []

    candidates: List[str] = []

    if os.path.isabs(normalized):
        candidates.append(os.path.normpath(normalized))
    else:
        basename = os.path.basename(normalized)
        candidates.extend([
            os.path.normpath(os.path.join(os.getcwd(), normalized)),
            os.path.normpath(os.path.join(MODEL_API_DIR, normalized)),
            os.path.normpath(os.path.join(PROJECT_ROOT, normalized)),
            os.path.normpath(os.path.join(BACKEND_DIR, normalized)),
            os.path.normpath(os.path.join(BACKEND_UPLOADS_DIR, basename)),
        ])
        if normalized.startswith("uploads/"):
            candidates.append(
                os.path.normpath(os.path.join(BACKEND_UPLOADS_DIR, normalized[len("uploads/"):]))
            )

    seen: set = set()
    unique_candidates: List[str] = []
    for candidate in candidates:
        if candidate not in seen:
            seen.add(candidate)
            unique_candidates.append(candidate)

    for candidate in unique_candidates:
        if os.path.isfile(candidate):
            return candidate, unique_candidates

    return None, unique_candidates


@app.on_event("startup")
def load_model_on_startup():
    global model, tokenizer
    print("Initializing tokenizers and model architecture...", flush=True)
    try:
        tokenizer = AutoTokenizer.from_pretrained("bert-base-uncased")
        model = MultiModalModel()

        print(f"Loading weights from: {MODEL_PATH}...", flush=True)
        state_dict = torch.load(MODEL_PATH, map_location=DEVICE)

        model.load_state_dict(state_dict, strict=True)
        model.to(DEVICE)
        model.eval()
        print("Model loaded successfully with strict=True!", flush=True)
    except Exception as e:
        print(f"CRITICAL ERROR: Failed to load model weights! {e}", file=sys.stderr, flush=True)
        os._exit(1)

@app.get("/health")
def health_check():
    if model is None or tokenizer is None:
        raise HTTPException(status_code=503, detail="Model is loading or failed to initialize.")
    return {"status": "healthy", "device": str(DEVICE)}

@app.post("/predict")
def predict(payload: PredictRequest):
    if model is None or tokenizer is None:
        raise HTTPException(status_code=503, detail="Model not loaded.")

    try:
        print(f"[predict] received text={payload.text!r}", flush=True)
        print(f"[predict] received url={payload.url!r}", flush=True)
        print(f"[predict] received image_path={payload.image_path!r}", flush=True)
        print(
            f"[predict] os.path.exists(image_path)="
            f"{os.path.exists(payload.image_path) if payload.image_path else False}",
            flush=True,
        )

        text_content = payload.text if payload.text else " "
        encoded = tokenizer(
            text_content,
            padding="max_length",
            truncation=True,
            max_length=128,
            return_tensors="pt"
        )

        input_ids = encoded["input_ids"].to(DEVICE)
        attention_mask = encoded["attention_mask"].to(DEVICE)

        image = None
        resolved_path = None
        image_requested = bool(payload.image_path and payload.image_path.strip())

        if image_requested:
            resolved_path, candidate_paths = resolve_image_path(payload.image_path)
            print(f"[predict] backend uploads dir={BACKEND_UPLOADS_DIR}", flush=True)
            print(f"[predict] image path candidates={candidate_paths}", flush=True)

            if resolved_path:
                try:
                    image = Image.open(resolved_path).convert("RGBA").convert("RGB")
                    image = image_transform(image).unsqueeze(0).to(DEVICE)
                except Exception as img_err:
                    print(
                        f"[predict] error reading resolved image at {resolved_path}: {img_err}",
                        flush=True,
                    )
                    resolved_path = None
            else:
                print(
                    f"[predict] image file not found for image_path={payload.image_path!r}",
                    flush=True,
                )

        image_loaded = image is not None
        print(f"[predict] resolved image path={resolved_path!r}", flush=True)
        print(f"[predict] image loaded={image_loaded}", flush=True)

        if not image_loaded:
            image = torch.zeros((1, 3, 224, 224)).to(DEVICE)
            if image_requested:
                print(
                    "[predict] image was requested but not loaded; using zero tensor (text-only signal)",
                    flush=True,
                )
            else:
                print("[predict] no image provided; using zero tensor for image branch", flush=True)

        with torch.no_grad():
            outputs = model(input_ids, attention_mask, image)
            probs = torch.softmax(outputs, dim=1)
            pred_idx = torch.argmax(probs, dim=1).item()
            confidence = probs[0][pred_idx].item()

            logits_list = outputs.squeeze(0).tolist()
            probs_list = probs.squeeze(0).tolist()
            label = CLASS_LABELS.get(pred_idx, f"Unknown({pred_idx})")

            print(f"[predict] raw logits={logits_list}", flush=True)
            print(f"[predict] probabilities={probs_list}", flush=True)
            print(f"[predict] predicted class index={pred_idx}", flush=True)
            print(f"[predict] final label={label!r}", flush=True)

        if image_requested and not image_loaded:
            explanation = "Warning: image file was not found, prediction used text only."
        elif image_loaded:
            explanation = "Model inference completed using text and image."
        else:
            explanation = "Model inference completed using text only."

        return {
            "label": label,
            "confidence": confidence,
            "explanation": explanation,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")
