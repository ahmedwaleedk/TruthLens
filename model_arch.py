import torch
import torch.nn as nn
from transformers import AutoModel
import torchvision.models as models


class MultiModalModel(nn.Module):
    def __init__(self, num_classes=2):
        super().__init__()

        self.text_model = AutoModel.from_pretrained("bert-base-uncased")

        resnet = models.resnet50(weights=models.ResNet50_Weights.IMAGENET1K_V1)
        resnet.fc = nn.Identity()
        self.image_model = resnet

        self.classifier = nn.Sequential(
            nn.Linear(768 + 2048, 512),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(512, num_classes)
        )

    def forward(self, input_ids, attention_mask, image):
        txt = self.text_model(
            input_ids=input_ids,
            attention_mask=attention_mask
        ).last_hidden_state[:, 0, :]

        img = self.image_model(image)
        fused = torch.cat([img, txt], dim=1)
        return self.classifier(fused)
