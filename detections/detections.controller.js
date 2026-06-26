"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DetectionsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const detections_service_1 = require("./detections.service");
const create_detection_dto_1 = require("./dto/create-detection.dto");
const update_detection_dto_1 = require("./dto/update-detection.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const model_service_1 = require("../model/model.service");
const multer_1 = require("multer");
const path_1 = require("path");
let DetectionsController = class DetectionsController {
    constructor(detectionsService, modelService) {
        this.detectionsService = detectionsService;
        this.modelService = modelService;
    }
    async detect(body, file, req) {
        const text = (body.text || '').trim();
        const url = (body.url || '').trim();
        const imagePath = file ? `uploads/${file.filename}` : null;
        if (!text && !url && !imagePath) {
            throw new common_1.BadRequestException('Please provide at least Text, Image, or URL.');
        }
        const prediction = await this.modelService.predictFakeNews(text, imagePath, url);
        const detection = await this.detectionsService.create({
            text,
            url,
            image_url: imagePath || '',
            label: prediction.label,
            confidence: prediction.confidence,
            explanation: prediction.explanation,
        }, req.user.username);
        return {
            id: detection._id.toString(),
            timestamp: detection.created_at,
            text_snippet: detection.text.substring(0, 200),
            url: detection.url,
            image_path: detection.image_url,
            label: detection.label,
            confidence: detection.confidence,
            explanation: detection.explanation,
        };
    }
    async create(createDto, req) {
        const detection = await this.detectionsService.create(createDto, req.user.username);
        return { ok: true, id: detection._id.toString() };
    }
    async getTrending(req) {
        try {
            return this.modelService.getTrendingFakeNews();
        }
        catch (error) {
            return this.modelService.getTrendingFakeNews();
        }
    }
    async getStats(req) {
        return this.detectionsService.getStats(req.user.username);
    }
    async findAll(req) {
        const detections = await this.detectionsService.findAll(req.user.username);
        return detections.map((d) => ({
            id: d._id.toString(),
            user_id: d.user_id,
            text: d.text,
            image_url: d.image_url,
            url: d.url,
            label: d.label,
            confidence: d.confidence,
            explanation: d.explanation,
            created_at: d.created_at,
        }));
    }
    async findOne(id, req) {
        const detection = await this.detectionsService.findOne(id, req.user.username);
        return {
            id: detection._id.toString(),
            user_id: detection.user_id,
            text: detection.text,
            image_url: detection.image_url,
            url: detection.url,
            label: detection.label,
            confidence: detection.confidence,
            explanation: detection.explanation,
            created_at: detection.created_at,
        };
    }
    async update(id, updateDto, req) {
        await this.detectionsService.update(id, updateDto, req.user.username);
        return { ok: true, modified_count: 1 };
    }
    async remove(id, req) {
        await this.detectionsService.remove(id, req.user.username);
        return { ok: true, deleted_count: 1 };
    }
};
exports.DetectionsController = DetectionsController;
__decorate([
    (0, common_1.Post)('detect'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads',
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                cb(null, `${uniqueSuffix}${(0, path_1.extname)(file.originalname)}`);
            },
        }),
        fileFilter: (req, file, cb) => {
            const allowedExtensions = ['.png', '.jpg', '.jpeg', '.webp'];
            const ext = (0, path_1.extname)(file.originalname).toLowerCase();
            if (allowedExtensions.includes(ext)) {
                cb(null, true);
            }
            else {
                cb(new common_1.BadRequestException('Invalid image type. Allowed: png, jpg, jpeg, webp.'), false);
            }
        },
        limits: { fileSize: 10 * 1024 * 1024 },
    })),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], DetectionsController.prototype, "detect", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_detection_dto_1.CreateDetectionDto, Object]),
    __metadata("design:returntype", Promise)
], DetectionsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('trending'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DetectionsController.prototype, "getTrending", null);
__decorate([
    (0, common_1.Get)('stats'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DetectionsController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DetectionsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DetectionsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_detection_dto_1.UpdateDetectionDto, Object]),
    __metadata("design:returntype", Promise)
], DetectionsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DetectionsController.prototype, "remove", null);
exports.DetectionsController = DetectionsController = __decorate([
    (0, common_1.Controller)('detections'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [detections_service_1.DetectionsService,
        model_service_1.ModelService])
], DetectionsController);
//# sourceMappingURL=detections.controller.js.map