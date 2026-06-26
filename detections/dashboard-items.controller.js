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
exports.DashboardItemsController = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const dashboard_item_schema_1 = require("../schemas/dashboard-item.schema");
let DashboardItemsController = class DashboardItemsController {
    constructor(dashboardItemModel) {
        this.dashboardItemModel = dashboardItemModel;
    }
    async getActiveItems() {
        const items = await this.dashboardItemModel.find({ is_active: true }).sort({ created_at: -1 }).exec();
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
};
exports.DashboardItemsController = DashboardItemsController;
__decorate([
    (0, common_1.Get)('active'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DashboardItemsController.prototype, "getActiveItems", null);
exports.DashboardItemsController = DashboardItemsController = __decorate([
    (0, common_1.Controller)('dashboard-items'),
    __param(0, (0, mongoose_1.InjectModel)(dashboard_item_schema_1.DashboardItem.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], DashboardItemsController);
//# sourceMappingURL=dashboard-items.controller.js.map