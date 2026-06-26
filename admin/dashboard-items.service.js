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
exports.DashboardItemsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const dashboard_item_schema_1 = require("../schemas/dashboard-item.schema");
let DashboardItemsService = class DashboardItemsService {
    constructor(dashboardItemModel) {
        this.dashboardItemModel = dashboardItemModel;
    }
    async findAll(activeOnly = false) {
        const query = activeOnly ? { is_active: true } : {};
        const items = await this.dashboardItemModel.find(query).sort({ created_at: -1 }).exec();
        return items.map((item) => ({
            id: item._id.toString(),
            title: item.title,
            description: item.description,
            url: item.url,
            source: item.source,
            tags: item.tags,
            is_active: item.is_active,
            created_at: item.created_at,
            updated_at: item.updated_at,
        }));
    }
    async findOne(id) {
        const item = await this.dashboardItemModel.findById(id).exec();
        if (!item) {
            throw new common_1.NotFoundException('Dashboard item not found');
        }
        return {
            id: item._id.toString(),
            title: item.title,
            description: item.description,
            url: item.url,
            source: item.source,
            tags: item.tags,
            is_active: item.is_active,
            created_at: item.created_at,
            updated_at: item.updated_at,
        };
    }
    async create(createData) {
        const now = new Date().toISOString() + 'Z';
        const item = new this.dashboardItemModel({
            ...createData,
            is_active: createData.is_active !== false,
            created_at: now,
            updated_at: now,
        });
        await item.save();
        return {
            id: item._id.toString(),
            title: item.title,
            description: item.description,
            url: item.url,
            source: item.source,
            tags: item.tags,
            is_active: item.is_active,
            created_at: item.created_at,
            updated_at: item.updated_at,
        };
    }
    async update(id, updateData) {
        const item = await this.dashboardItemModel.findById(id).exec();
        if (!item) {
            throw new common_1.NotFoundException('Dashboard item not found');
        }
        Object.assign(item, updateData);
        item.updated_at = new Date().toISOString() + 'Z';
        await item.save();
        return {
            id: item._id.toString(),
            title: item.title,
            description: item.description,
            url: item.url,
            source: item.source,
            tags: item.tags,
            is_active: item.is_active,
            created_at: item.created_at,
            updated_at: item.updated_at,
        };
    }
    async delete(id) {
        const result = await this.dashboardItemModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new common_1.NotFoundException('Dashboard item not found');
        }
        return { success: true };
    }
};
exports.DashboardItemsService = DashboardItemsService;
exports.DashboardItemsService = DashboardItemsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(dashboard_item_schema_1.DashboardItem.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], DashboardItemsService);
//# sourceMappingURL=dashboard-items.service.js.map