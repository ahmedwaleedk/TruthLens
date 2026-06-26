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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../schemas/user.schema");
const detection_schema_1 = require("../schemas/detection.schema");
let AdminService = class AdminService {
    constructor(userModel, detectionModel) {
        this.userModel = userModel;
        this.detectionModel = detectionModel;
    }
    async getStats() {
        const totalUsers = await this.userModel.countDocuments({});
        const totalDetections = await this.detectionModel.countDocuments({});
        const fakeCount = await this.detectionModel.countDocuments({ label: 'Fake' });
        const realCount = await this.detectionModel.countDocuments({ label: 'Real' });
        return {
            total_users: totalUsers,
            total_detections: totalDetections,
            fake_count: fakeCount,
            real_count: realCount,
        };
    }
    async getRecentDetections(limit = 20) {
        const detections = await this.detectionModel
            .find({})
            .sort({ created_at: -1 })
            .limit(limit)
            .exec();
        return detections.map((doc) => {
            const textOrUrl = doc.text || doc.url || 'No input';
            return {
                id: doc._id.toString(),
                user_id: doc.user_id,
                label: doc.label,
                confidence: doc.confidence,
                created_at: doc.created_at,
                text_snippet: textOrUrl.substring(0, 100),
            };
        });
    }
    async getDetections() {
        return this.getRecentDetections(20);
    }
    async getDetectionById(id) {
        const detection = await this.detectionModel.findById(id).exec();
        if (!detection) {
            return null;
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
    async deleteDetection(id) {
        const result = await this.detectionModel.findByIdAndDelete(id).exec();
        return result !== null;
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(detection_schema_1.Detection.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], AdminService);
//# sourceMappingURL=admin.service.js.map