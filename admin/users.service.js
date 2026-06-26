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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../schemas/user.schema");
const detection_schema_1 = require("../schemas/detection.schema");
let UsersService = class UsersService {
    constructor(userModel, detectionModel) {
        this.userModel = userModel;
        this.detectionModel = detectionModel;
    }
    async findAll(page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const users = await this.userModel.find({}).skip(skip).limit(limit).sort({ created_at: -1 }).exec();
        const total = await this.userModel.countDocuments({});
        const usersWithCounts = await Promise.all(users.map(async (user) => {
            const detectionCount = await this.detectionModel.countDocuments({ user_id: user.username });
            return {
                id: user._id.toString(),
                username: user.username,
                role: user.role,
                created_at: user.created_at,
                last_login_at: user.last_login_at || '',
                is_active: user.is_active !== false,
                detections_count: detectionCount,
            };
        }));
        return {
            users: usersWithCounts,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findOne(id) {
        const user = await this.userModel.findById(id).exec();
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const detectionCount = await this.detectionModel.countDocuments({ user_id: user.username });
        return {
            id: user._id.toString(),
            username: user.username,
            role: user.role,
            created_at: user.created_at,
            last_login_at: user.last_login_at || '',
            is_active: user.is_active !== false,
            detections_count: detectionCount,
        };
    }
    async delete(id) {
        const user = await this.userModel.findById(id).exec();
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        await this.detectionModel.deleteMany({ user_id: user.username }).exec();
        await this.userModel.findByIdAndDelete(id).exec();
        return { success: true };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(detection_schema_1.Detection.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], UsersService);
//# sourceMappingURL=users.service.js.map