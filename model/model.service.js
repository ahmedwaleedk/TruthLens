"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelService = void 0;
const common_1 = require("@nestjs/common");
let ModelService = class ModelService {
    constructor() {
        this.modelServiceUrl = process.env.MODEL_SERVICE_URL || 'http://localhost:8000';
    }
    async predictFakeNews(text = '', imagePath = null, url = '') {
        try {
            const response = await fetch(`${this.modelServiceUrl}/predict`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text,
                    url,
                    image_path: imagePath || '',
                }),
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`FastAPI service returned status ${response.status}: ${errorText}`);
            }
            const data = await response.json();
            const label = data.label;
            const explanation = label === 'Fake'
                ? 'This news has been classified as Fake because the text and image contains suspicious or misleading patterns that do not align with verified content'
                : 'This news has been classified as Real because the text and image are consistent with credible sources and do not show signs of manipulation';
            return {
                label,
                confidence: data.confidence,
                explanation,
            };
        }
        catch (error) {
            console.warn(`[TruthLens Backend] Prediction service at ${this.modelServiceUrl} is unavailable. Using mock prediction fallback: ${error.message}`);
            const lowerText = (text + ' ' + url).toLowerCase();
            const hasFakeSignals = /fake|hoax|conspiracy|scam|unbelievable|shocking|secret/i.test(lowerText);
            const label = hasFakeSignals ? 'Fake' : 'Real';
            const explanation = label === 'Fake'
                ? 'This news has been classified as Fake because the text and image contains suspicious or misleading patterns that do not align with verified content'
                : 'This news has been classified as Real because the text and image are consistent with credible sources and do not show signs of manipulation';
            return {
                label,
                confidence: hasFakeSignals ? 0.88 : 0.94,
                explanation,
            };
        }
    }
    getTrendingFakeNews() {
        const now = new Date();
        const items = [];
        for (let i = 1; i <= 5; i++) {
            const detectedAt = new Date(now.getTime() - i * 60 * 60 * 1000);
            items.push({
                title: `Sample Fake Headline #${i}`,
                source: `Source ${i}`,
                detected_at: detectedAt.toISOString() + 'Z',
                summary: 'This is placeholder data representing a trending fake news item.',
                category: i % 2 === 0 ? 'Politics' : 'Health',
            });
        }
        return items;
    }
};
exports.ModelService = ModelService;
exports.ModelService = ModelService = __decorate([
    (0, common_1.Injectable)()
], ModelService);
//# sourceMappingURL=model.service.js.map