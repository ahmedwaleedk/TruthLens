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
exports.DetectionsAdminService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const detection_schema_1 = require("../schemas/detection.schema");
let DetectionsAdminService = class DetectionsAdminService {
    constructor(detectionModel) {
        this.detectionModel = detectionModel;
    }
    async findAll(filters) {
        const query = {};
        if (filters.user) {
            query.user_id = filters.user;
        }
        if (filters.label) {
            query.label = filters.label;
        }
        if (filters.startDate || filters.endDate) {
            query.created_at = {};
            if (filters.startDate) {
                query.created_at.$gte = filters.startDate;
            }
            if (filters.endDate) {
                query.created_at.$lte = filters.endDate;
            }
        }
        if (filters.search) {
            query.$or = [
                { text: { $regex: filters.search, $options: 'i' } },
                { url: { $regex: filters.search, $options: 'i' } },
            ];
        }
        const page = filters.page || 1;
        const limit = filters.limit || 20;
        const skip = (page - 1) * limit;
        const detections = await this.detectionModel
            .find(query)
            .sort({ created_at: -1 })
            .skip(skip)
            .limit(limit)
            .exec();
        const total = await this.detectionModel.countDocuments(query);
        return {
            detections: detections.map((doc) => ({
                id: doc._id.toString(),
                user_id: doc.user_id,
                text: doc.text,
                image_url: doc.image_url,
                url: doc.url,
                label: doc.label,
                confidence: doc.confidence,
                explanation: doc.explanation,
                created_at: doc.created_at,
            })),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findOne(id) {
        const detection = await this.detectionModel.findById(id).exec();
        if (!detection) {
            throw new common_1.NotFoundException('Detection not found');
        }
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
    async update(id, updateData) {
        const detection = await this.detectionModel.findById(id).exec();
        if (!detection) {
            throw new common_1.NotFoundException('Detection not found');
        }
        Object.assign(detection, updateData);
        await detection.save();
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
    async delete(id) {
        const result = await this.detectionModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new common_1.NotFoundException('Detection not found');
        }
        return { success: true };
    }
};
exports.DetectionsAdminService = DetectionsAdminService;
exports.DetectionsAdminService = DetectionsAdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(detection_schema_1.Detection.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], DetectionsAdminService);
//# sourceMappingURL=detections-admin.service.js.map