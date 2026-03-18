"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const app_controller_1 = require("./app.controller");
const firebase_module_1 = require("./firebase/firebase.module");
const prisma_module_1 = require("./prisma/prisma.module");
const music_generation_module_1 = require("./music/module/music-generation.module");
const playlist_module_1 = require("./playlist/module/playlist.module");
const subscription_module_1 = require("./subscription/module/subscription.module");
const account_module_1 = require("./account/account.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            firebase_module_1.FirebaseModule,
            prisma_module_1.PrismaModule,
            music_generation_module_1.MusicGenerationModule,
            playlist_module_1.PlaylistModule,
            subscription_module_1.SubscriptionModule,
            account_module_1.AccountModule,
        ],
        controllers: [app_controller_1.AppController],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map