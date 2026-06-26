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
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const admin_service_1 = require("./admin.service");
const users_service_1 = require("./users.service");
const detections_admin_service_1 = require("./detections-admin.service");
const dashboard_items_service_1 = require("./dashboard-items.service");
const audit_logs_service_1 = require("./audit-logs.service");
const audit_service_1 = require("./audit.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
let AdminController = class AdminController {
    constructor(adminService, usersService, detectionsAdminService, dashboardItemsService, auditLogsService, auditService) {
        this.adminService = adminService;
        this.usersService = usersService;
        this.detectionsAdminService = detectionsAdminService;
        this.dashboardItemsService = dashboardItemsService;
        this.auditLogsService = auditLogsService;
        this.auditService = auditService;
    }
    async getStats(req) {
        const ipAddress = req.ip || req.headers['x-forwarded-for'] || 'unknown';
        await this.auditService.log('VIEW_STATS', req.user.username, 'system', 'stats', { ip: ipAddress });
        const stats = await this.adminService.getStats();
        return stats;
    }
    async getUsers(page, limit, req) {
        const ipAddress = req.ip || req.headers['x-forwarded-for'] || 'unknown';
        await this.auditService.log('VIEW_USERS', req.user.username, 'user', 'list', { ip: ipAddress });
        return this.usersService.findAll(page ? parseInt(page) : 1, limit ? parseInt(limit) : 20);
    }
    async getUserById(id, req) {
        const ipAddress = req.ip || req.headers['x-forwarded-for'] || 'unknown';
        await this.auditService.log('VIEW_USER', req.user.username, 'user', id, { ip: ipAddress });
        return this.usersService.findOne(id);
    }
    async deleteUser(id, req) {
        const ipAddress = req.ip || req.headers['x-forwarded-for'] || 'unknown';
        await this.usersService.delete(id);
        await this.auditService.log('DELETE_USER', req.user.username, 'user', id, { ip: ipAddress });
        return { ok: true, deleted_count: 1 };
    }
    async getDetections(user, label, startDate, endDate, search, page, limit, req) {
        const ipAddress = req.ip || req.headers['x-forwarded-for'] || 'unknown';
        await this.auditService.log('VIEW_DETECTIONS', req.user.username, 'detection', 'list', { ip: ipAddress });
        return this.detectionsAdminService.findAll({
            user,
            label,
            startDate,
            endDate,
            search,
            page: page ? parseInt(page) : 1,
            limit: limit ? parseInt(limit) : 20,
        });
    }
    async getDetectionById(id, req) {
        const ipAddress = req.ip || req.headers['x-forwarded-for'] || 'unknown';
        await this.auditService.log('VIEW_DETECTION', req.user.username, 'detection', id, { ip: ipAddress });
        return this.detectionsAdminService.findOne(id);
    }
    async updateDetection(id, updateData, req) {
        const ipAddress = req.ip || req.headers['x-forwarded-for'] || 'unknown';
        const result = await this.detectionsAdminService.update(id, updateData);
        await this.auditService.log('UPDATE_DETECTION', req.user.username, 'detection', id, { ip: ipAddress, updates: updateData });
        return result;
    }
    async deleteDetection(id, req) {
        const ipAddress = req.ip || req.headers['x-forwarded-for'] || 'unknown';
        await this.detectionsAdminService.delete(id);
        await this.auditService.log('DELETE_DETECTION', req.user.username, 'detection', id, { ip: ipAddress });
        return { ok: true, deleted_count: 1 };
    }
    async getDashboardItems(activeOnly, req) {
        const ipAddress = req.ip || req.headers['x-forwarded-for'] || 'unknown';
        await this.auditService.log('VIEW_DASHBOARD_ITEMS', req.user.username, 'dashboard_item', 'list', { ip: ipAddress });
        return this.dashboardItemsService.findAll(activeOnly === 'true');
    }
    async getDashboardItemById(id, req) {
        const ipAddress = req.ip || req.headers['x-forwarded-for'] || 'unknown';
        await this.auditService.log('VIEW_DASHBOARD_ITEM', req.user.username, 'dashboard_item', id, { ip: ipAddress });
        return this.dashboardItemsService.findOne(id);
    }
    async createDashboardItem(createData, req) {
        const ipAddress = req.ip || req.headers['x-forwarded-for'] || 'unknown';
        const result = await this.dashboardItemsService.create(createData);
        await this.auditService.log('CREATE_DASHBOARD_ITEM', req.user.username, 'dashboard_item', result.id, { ip: ipAddress });
        return result;
    }
    async updateDashboardItem(id, updateData, req) {
        const ipAddress = req.ip || req.headers['x-forwarded-for'] || 'unknown';
        const result = await this.dashboardItemsService.update(id, updateData);
        await this.auditService.log('UPDATE_DASHBOARD_ITEM', req.user.username, 'dashboard_item', id, { ip: ipAddress, updates: updateData });
        return result;
    }
    async deleteDashboardItem(id, req) {
        const ipAddress = req.ip || req.headers['x-forwarded-for'] || 'unknown';
        await this.dashboardItemsService.delete(id);
        await this.auditService.log('DELETE_DASHBOARD_ITEM', req.user.username, 'dashboard_item', id, { ip: ipAddress });
        return { ok: true, deleted_count: 1 };
    }
    async getAuditLogs(actor, action, targetType, startDate, endDate, page, limit, req) {
        const ipAddress = req.ip || req.headers['x-forwarded-for'] || 'unknown';
        await this.auditService.log('VIEW_AUDIT_LOGS', req.user.username, 'audit_log', 'list', { ip: ipAddress });
        return this.auditLogsService.findAll({
            actor,
            action,
            targetType,
            startDate,
            endDate,
            page: page ? parseInt(page) : 1,
            limit: limit ? parseInt(limit) : 50,
        });
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('stats'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('users'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getUsers", null);
__decorate([
    (0, common_1.Get)('users/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getUserById", null);
__decorate([
    (0, common_1.Delete)('users/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteUser", null);
__decorate([
    (0, common_1.Get)('detections'),
    __param(0, (0, common_1.Query)('user')),
    __param(1, (0, common_1.Query)('label')),
    __param(2, (0, common_1.Query)('startDate')),
    __param(3, (0, common_1.Query)('endDate')),
    __param(4, (0, common_1.Query)('search')),
    __param(5, (0, common_1.Query)('page')),
    __param(6, (0, common_1.Query)('limit')),
    __param(7, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getDetections", null);
__decorate([
    (0, common_1.Get)('detections/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getDetectionById", null);
__decorate([
    (0, common_1.Patch)('detections/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateDetection", null);
__decorate([
    (0, common_1.Delete)('detections/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteDetection", null);
__decorate([
    (0, common_1.Get)('dashboard-items'),
    __param(0, (0, common_1.Query)('activeOnly')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getDashboardItems", null);
__decorate([
    (0, common_1.Get)('dashboard-items/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getDashboardItemById", null);
__decorate([
    (0, common_1.Post)('dashboard-items'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createDashboardItem", null);
__decorate([
    (0, common_1.Patch)('dashboard-items/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateDashboardItem", null);
__decorate([
    (0, common_1.Delete)('dashboard-items/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteDashboardItem", null);
__decorate([
    (0, common_1.Get)('audit-logs'),
    __param(0, (0, common_1.Query)('actor')),
    __param(1, (0, common_1.Query)('action')),
    __param(2, (0, common_1.Query)('targetType')),
    __param(3, (0, common_1.Query)('startDate')),
    __param(4, (0, common_1.Query)('endDate')),
    __param(5, (0, common_1.Query)('page')),
    __param(6, (0, common_1.Query)('limit')),
    __param(7, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAuditLogs", null);
exports.AdminController = AdminController = __decorate([
    (0, common_1.Controller)('admin'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    __metadata("design:paramtypes", [admin_service_1.AdminService,
        users_service_1.UsersService,
        detections_admin_service_1.DetectionsAdminService,
        dashboard_items_service_1.DashboardItemsService,
        audit_logs_service_1.AuditLogsService,
        audit_service_1.AuditService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map