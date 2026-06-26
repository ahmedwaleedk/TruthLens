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
exports.DetectionsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const detection_schema_1 = require("../schemas/detection.schema");
let DetectionsService = class DetectionsService {
    constructor(detectionModel) {
        this.detectionModel = detectionModel;
    }
    isAdmin(username) {
        const adminUsers = (process.env.ADMIN_USERS || '')
            .split(',')
            .map((u) => u.trim().toLowerCase())
            .filter((u) => u);
        return adminUsers.includes((username || '').trim().toLowerCase());
    }
    async create(createDto, userId) {
        const detection = new this.detectionModel({
            ...createDto,
            user_id: userId,
            text: createDto.text || '',
            image_url: createDto.image_url || '',
            url: createDto.url || '',
            explanation: createDto.explanation || '',
            created_at: new Date().toISOString() + 'Z',
        });
        return detection.save();
    }
    async findAll(userId) {
        const query = this.isAdmin(userId) ? {} : { user_id: userId };
        return this.detectionModel.find(query).sort({ created_at: -1 }).exec();
    }
    async findOne(id, userId) {
        const detection = await this.detectionModel.findById(id).exec();
        if (!detection) {
            throw new common_1.NotFoundException('Detection not found');
        }
        if (!this.isAdmin(userId) && detection.user_id !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return detection;
    }
    async update(id, updateDto, userId) {
        const detection = await this.findOne(id, userId);
        Object.assign(detection, updateDto);
        return detection.save();
    }
    async remove(id, userId) {
        const detection = await this.findOne(id, userId);
        await this.detectionModel.findByIdAndDelete(id).exec();
    }
    async getStats(userId) {
        const query = this.isAdmin(userId) ? {} : { user_id: userId };
        const [totalDetections, fakeCount, realCount, avgResult, recentDocs] = await Promise.all([
            this.detectionModel.countDocuments(query),
            this.detectionModel.countDocuments({ ...query, label: 'Fake' }),
            this.detectionModel.countDocuments({ ...query, label: 'Real' }),
            this.detectionModel.aggregate([
                { $match: query },
                { $group: { _id: null, avg: { $avg: '$confidence' } } },
            ]),
            this.detectionModel.find(query).sort({ created_at: -1 }).limit(8).exec(),
        ]);
        const rawAvg = avgResult[0]?.avg ?? 0;
        const averageConfidence = rawAvg <= 1 ? rawAvg * 100 : rawAvg;
        return {
            total_detections: totalDetections,
            fake_count: fakeCount,
            real_count: realCount,
            average_confidence: Math.round(averageConfidence * 10) / 10,
            recent_detections: recentDocs.map((d) => ({
                id: d._id.toString(),
                label: d.label,
                confidence: d.confidence,
                created_at: d.created_at,
                text_snippet: (d.text || d.url || 'No input').substring(0, 100),
            })),
        };
    }
};
exports.DetectionsService = DetectionsService;
exports.DetectionsService = DetectionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(detection_schema_1.Detection.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], DetectionsService);
//# sourceMappingURL=detections.service.js.map