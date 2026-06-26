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
exports.AuditLogsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const audit_log_schema_1 = require("../schemas/audit-log.schema");
let AuditLogsService = class AuditLogsService {
    constructor(auditLogModel) {
        this.auditLogModel = auditLogModel;
    }
    async findAll(filters) {
        const query = {};
        if (filters.actor) {
            query.actor_username = { $regex: filters.actor, $options: 'i' };
        }
        if (filters.action) {
            query.action = { $regex: filters.action, $options: 'i' };
        }
        if (filters.targetType) {
            query.target_type = filters.targetType;
        }
        if (filters.startDate || filters.endDate) {
            query.timestamp = {};
            if (filters.startDate) {
                query.timestamp.$gte = filters.startDate;
            }
            if (filters.endDate) {
                query.timestamp.$lte = filters.endDate;
            }
        }
        const page = filters.page || 1;
        const limit = filters.limit || 50;
        const skip = (page - 1) * limit;
        const logs = await this.auditLogModel
            .find(query)
            .sort({ timestamp: -1 })
            .skip(skip)
            .limit(limit)
            .exec();
        const total = await this.auditLogModel.countDocuments(query);
        return {
            logs: logs.map((log) => ({
                id: log._id.toString(),
                actor_username: log.actor_username,
                action: log.action,
                target_type: log.target_type,
                target_id: log.target_id,
                timestamp: log.timestamp,
                meta: log.meta,
            })),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
};
exports.AuditLogsService = AuditLogsService;
exports.AuditLogsService = AuditLogsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(audit_log_schema_1.AuditLog.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], AuditLogsService);
//# sourceMappingURL=audit-logs.service.js.map