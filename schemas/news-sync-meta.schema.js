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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsSyncMetaSchema = exports.NewsSyncMeta = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let NewsSyncMeta = class NewsSyncMeta {
};
exports.NewsSyncMeta = NewsSyncMeta;
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true, default: 'guardian_world_rss' }),
    __metadata("design:type", String)
], NewsSyncMeta.prototype, "feed_id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", String)
], NewsSyncMeta.prototype, "last_success_at", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", String)
], NewsSyncMeta.prototype, "last_attempt_at", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", String)
], NewsSyncMeta.prototype, "last_error", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], NewsSyncMeta.prototype, "article_count", void 0);
exports.NewsSyncMeta = NewsSyncMeta = __decorate([
    (0, mongoose_1.Schema)({ collection: 'news_sync_meta' })
], NewsSyncMeta);
exports.NewsSyncMetaSchema = mongoose_1.SchemaFactory.createForClass(NewsSyncMeta);
//# sourceMappingURL=news-sync-meta.schema.js.map