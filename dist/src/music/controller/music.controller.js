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
exports.MusicController = void 0;
const common_1 = require("@nestjs/common");
const firebase_auth_guard_1 = require("../../firebase/guards/firebase_auth_guard");
const current_user_decorator_1 = require("../../firebase/decorators/current-user.decorator");
const allowed_tags_1 = require("../constants/allowed-tags");
const generate_music_dto_1 = require("../dto/generate-music.dto");
const validate_sonauto_pipe_1 = require("../pipes/validate-sonauto.pipe");
const music_service_1 = require("../service/music.service");
let MusicController = class MusicController {
    constructor(musicService) {
        this.musicService = musicService;
    }
    getTags() {
        return [...allowed_tags_1.ALLOWED_TAGS];
    }
    async generateMusic(user, dto) {
        return this.musicService.createGeneration(user.uid, dto);
    }
    async getMyGeneration(user) {
        return this.musicService.getUserGeneration(user.uid);
    }
    async getGenerationById(user, generationId) {
        return this.musicService.getGenerationById(user.uid, generationId);
    }
    async deleteGeneration(user, generationId) {
        await this.musicService.deleteGeneration(user.uid, generationId);
    }
    async addFavorite(user, generationId) {
        return this.musicService.addUserFavorite(user.uid, generationId);
    }
    async getMyFavorites(user) {
        return this.musicService.getUserFavorites(user.uid);
    }
    async deleteMyFavorite(user, generationId) {
        await this.musicService.deleteUserFavorite(user.uid, generationId);
    }
};
exports.MusicController = MusicController;
__decorate([
    (0, common_1.Get)('tags'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Array)
], MusicController.prototype, "getTags", null);
__decorate([
    (0, common_1.Post)('generate'),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)(validate_sonauto_pipe_1.ValidateSonautoPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, generate_music_dto_1.GenerateMusicDto]),
    __metadata("design:returntype", Promise)
], MusicController.prototype, "generateMusic", null);
__decorate([
    (0, common_1.Get)('generations'),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MusicController.prototype, "getMyGeneration", null);
__decorate([
    (0, common_1.Get)('generations/:id'),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], MusicController.prototype, "getGenerationById", null);
__decorate([
    (0, common_1.Delete)('generations/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], MusicController.prototype, "deleteGeneration", null);
__decorate([
    (0, common_1.Post)('generations/:id/favorite'),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], MusicController.prototype, "addFavorite", null);
__decorate([
    (0, common_1.Get)('favorites'),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MusicController.prototype, "getMyFavorites", null);
__decorate([
    (0, common_1.Delete)('favorites/:generationId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('generationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], MusicController.prototype, "deleteMyFavorite", null);
exports.MusicController = MusicController = __decorate([
    (0, common_1.Controller)('music'),
    __metadata("design:paramtypes", [music_service_1.MusicGenerationService])
], MusicController);
//# sourceMappingURL=music.controller.js.map