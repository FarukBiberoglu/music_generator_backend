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
exports.AccountService = void 0;
const common_1 = require("@nestjs/common");
const firebase_admin_1 = require("../firebase/firebase-admin");
const prisma_service_1 = require("../prisma/prisma.service");
let AccountService = class AccountService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async deleteAccount(firebaseUid) {
        const user = await this.prisma.userModel.findUnique({
            where: { firebaseUid },
            select: { id: true },
        });
        if (user) {
            await this.prisma.$transaction(async (tx) => {
                await tx.favorite.deleteMany({ where: { userId: user.id } });
                await tx.playlist.deleteMany({ where: { userId: user.id } });
                const generations = await tx.musicGeneration.findMany({
                    where: { userId: user.id },
                    select: { id: true },
                });
                const generationIds = generations.map((g) => g.id);
                if (generationIds.length > 0) {
                    await tx.song.deleteMany({
                        where: { generationId: { in: generationIds } },
                    });
                    await tx.musicGeneration.deleteMany({
                        where: { userId: user.id },
                    });
                }
                await tx.userModel.delete({ where: { id: user.id } });
            });
        }
        try {
            await firebase_admin_1.admin.auth().deleteUser(firebaseUid);
        }
        catch (err) {
            const message = err instanceof Error ? err.message : 'Firebase delete failed';
            throw new common_1.NotFoundException(`Hesap veritabanından silindi ancak Firebase kullanıcısı silinirken hata: ${message}`);
        }
        return { message: 'Hesap başarıyla silindi.' };
    }
};
exports.AccountService = AccountService;
exports.AccountService = AccountService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AccountService);
//# sourceMappingURL=account.service.js.map