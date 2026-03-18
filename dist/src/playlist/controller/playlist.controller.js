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
exports.PlaylistController = void 0;
const common_1 = require("@nestjs/common");
const plalylist_service_1 = require("../service/plalylist.service");
const firebase_auth_guard_1 = require("../../firebase/guards/firebase_auth_guard");
const current_user_decorator_1 = require("../../firebase/decorators/current-user.decorator");
const create_playlist_dto_1 = require("../dto/create-playlist.dto");
const add_playlist_item_dto_1 = require("../dto/add-playlist-item.dto");
let PlaylistController = class PlaylistController {
    constructor(playlistService) {
        this.playlistService = playlistService;
    }
    async create(user, dto) {
        return this.playlistService.create(user.uid, dto);
    }
    async findMyPlaylists(user) {
        return this.playlistService.findMyPlaylists(user.uid);
    }
    async findOne(user, playlistId) {
        return this.playlistService.findOne(user.uid, playlistId);
    }
    async addItem(user, playlistId, dto) {
        return this.playlistService.addItem(user.uid, playlistId, dto);
    }
    async removeItem(user, playlistId, itemId) {
        await this.playlistService.removeItem(user.uid, playlistId, itemId);
    }
    async deletePlaylist(user, playlistId) {
        await this.playlistService.deletePlaylist(user.uid, playlistId);
    }
};
exports.PlaylistController = PlaylistController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_playlist_dto_1.CreatePlaylistDto]),
    __metadata("design:returntype", Promise)
], PlaylistController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PlaylistController.prototype, "findMyPlaylists", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PlaylistController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(':id/items'),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, add_playlist_item_dto_1.AddPlaylistItemDto]),
    __metadata("design:returntype", Promise)
], PlaylistController.prototype, "addItem", null);
__decorate([
    (0, common_1.Delete)(':id/items/:itemId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Param)('itemId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], PlaylistController.prototype, "removeItem", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PlaylistController.prototype, "deletePlaylist", null);
exports.PlaylistController = PlaylistController = __decorate([
    (0, common_1.Controller)('playlists'),
    __metadata("design:paramtypes", [plalylist_service_1.PlaylistService])
], PlaylistController);
//# sourceMappingURL=playlist.controller.js.map