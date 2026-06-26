"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DetectionsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const detections_controller_1 = require("./detections.controller");
const dashboard_items_controller_1 = require("./dashboard-items.controller");
const detections_service_1 = require("./detections.service");
const detection_schema_1 = require("../schemas/detection.schema");
const dashboard_item_schema_1 = require("../schemas/dashboard-item.schema");
const model_service_1 = require("../model/model.service");
const platform_express_1 = require("@nestjs/platform-express");
let DetectionsModule = class DetectionsModule {
};
exports.DetectionsModule = DetectionsModule;
exports.DetectionsModule = DetectionsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: detection_schema_1.Detection.name, schema: detection_schema_1.DetectionSchema },
                { name: dashboard_item_schema_1.DashboardItem.name, schema: dashboard_item_schema_1.DashboardItemSchema },
            ]),
            platform_express_1.MulterModule.register({
                dest: './uploads',
            }),
        ],
        controllers: [detections_controller_1.DetectionsController, dashboard_items_controller_1.DashboardItemsController],
        providers: [detections_service_1.DetectionsService, model_service_1.ModelService],
        exports: [detections_service_1.DetectionsService],
    })
], DetectionsModule);
//# sourceMappingURL=detections.module.js.map