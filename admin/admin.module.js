"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const admin_controller_1 = require("./admin.controller");
const admin_service_1 = require("./admin.service");
const users_service_1 = require("./users.service");
const detections_admin_service_1 = require("./detections-admin.service");
const dashboard_items_service_1 = require("./dashboard-items.service");
const audit_logs_service_1 = require("./audit-logs.service");
const audit_service_1 = require("./audit.service");
const user_schema_1 = require("../schemas/user.schema");
const detection_schema_1 = require("../schemas/detection.schema");
const audit_log_schema_1 = require("../schemas/audit-log.schema");
const dashboard_item_schema_1 = require("../schemas/dashboard-item.schema");
let AdminModule = class AdminModule {
};
exports.AdminModule = AdminModule;
exports.AdminModule = AdminModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
                { name: detection_schema_1.Detection.name, schema: detection_schema_1.DetectionSchema },
                { name: audit_log_schema_1.AuditLog.name, schema: audit_log_schema_1.AuditLogSchema },
                { name: dashboard_item_schema_1.DashboardItem.name, schema: dashboard_item_schema_1.DashboardItemSchema },
            ]),
        ],
        controllers: [admin_controller_1.AdminController],
        providers: [
            admin_service_1.AdminService,
            users_service_1.UsersService,
            detections_admin_service_1.DetectionsAdminService,
            dashboard_items_service_1.DashboardItemsService,
            audit_logs_service_1.AuditLogsService,
            audit_service_1.AuditService,
        ],
        exports: [audit_service_1.AuditService, dashboard_items_service_1.DashboardItemsService],
    })
], AdminModule);
//# sourceMappingURL=admin.module.js.map