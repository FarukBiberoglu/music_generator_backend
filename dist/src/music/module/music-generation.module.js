"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MusicGenerationModule = void 0;
const common_1 = require("@nestjs/common");
const music_controller_1 = require("../controller/music.controller");
const music_service_1 = require("../service/music.service");
const sonauto_client_1 = require("../sonauto.client");
const subscription_module_1 = require("../../subscription/module/subscription.module");
let MusicGenerationModule = class MusicGenerationModule {
};
exports.MusicGenerationModule = MusicGenerationModule;
exports.MusicGenerationModule = MusicGenerationModule = __decorate([
    (0, common_1.Module)({
        imports: [subscription_module_1.SubscriptionModule],
        controllers: [music_controller_1.MusicController],
        providers: [music_service_1.MusicGenerationService, sonauto_client_1.SonautoClient],
        exports: [music_service_1.MusicGenerationService],
    })
], MusicGenerationModule);
//# sourceMappingURL=music-generation.module.js.map