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
exports.SubscriptionService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const plans_1 = require("../constants/plans");
let SubscriptionService = class SubscriptionService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findOrCreateUser(firebaseUid) {
        const existing = await this.prisma.userModel.findUnique({
            where: { firebaseUid },
        });
        if (existing)
            return existing;
        try {
            return await this.prisma.userModel.create({
                data: { firebaseUid },
            });
        }
        catch (e) {
            const isUniqueViolation = e &&
                typeof e === 'object' &&
                'code' in e &&
                e.code === 'P2002';
            if (isUniqueViolation) {
                return this.prisma.userModel.findUniqueOrThrow({
                    where: { firebaseUid },
                });
            }
            throw e;
        }
    }
    async resetCreditsIfExpired(userId) {
        const user = (await this.prisma.userModel.findUnique({
            where: { id: userId },
            select: { subscriptionEndsAt: true, creditsRemaining: true },
        }));
        if (!user?.subscriptionEndsAt)
            return;
        const now = new Date();
        if (user.subscriptionEndsAt.getTime() > now.getTime())
            return;
        await this.prisma.userModel.update({
            where: { id: userId },
            data: {
                creditsRemaining: 0,
                subscriptionPlan: null,
                subscriptionEndsAt: null,
            },
        });
    }
    async getCredits(firebaseUid) {
        const user = await this.findOrCreateUser(firebaseUid);
        await this.resetCreditsIfExpired(user.id);
        const updated = await this.prisma.userModel.findUniqueOrThrow({
            where: { id: user.id },
            select: {
                creditsRemaining: true,
                subscriptionPlan: true,
                subscriptionEndsAt: true,
            },
        });
        return {
            creditsRemaining: updated.creditsRemaining,
            subscriptionPlan: updated.subscriptionPlan,
            subscriptionEndsAt: updated.subscriptionEndsAt,
        };
    }
    async consumeCredit(firebaseUid) {
        const user = await this.findOrCreateUser(firebaseUid);
        await this.resetCreditsIfExpired(user.id);
        const current = await this.prisma.userModel.findUniqueOrThrow({
            where: { id: user.id },
            select: { creditsRemaining: true, subscriptionEndsAt: true },
        });
        if (current.creditsRemaining < 1 ||
            (current.subscriptionEndsAt && current.subscriptionEndsAt <= new Date())) {
            throw new common_1.ForbiddenException('Yeterli krediniz yok veya aboneliğiniz sona erdi. Lütfen paket satın alın.');
        }
        await this.prisma.userModel.update({
            where: { id: user.id },
            data: { creditsRemaining: { decrement: 1 } },
        });
        return this.prisma.userModel.findUniqueOrThrow({
            where: { id: user.id },
        });
    }
    async refundCredit(firebaseUid) {
        const user = await this.findOrCreateUser(firebaseUid);
        await this.resetCreditsIfExpired(user.id);
        const current = await this.prisma.userModel.findUniqueOrThrow({
            where: { id: user.id },
            select: { subscriptionEndsAt: true },
        });
        if (current.subscriptionEndsAt &&
            current.subscriptionEndsAt <= new Date()) {
            return;
        }
        await this.prisma.userModel.update({
            where: { id: user.id },
            data: { creditsRemaining: { increment: 1 } },
        });
    }
    resolvePlan(dto) {
        if (dto.plan && plans_1.PLAN_CONFIG[dto.plan])
            return dto.plan;
        if (dto.productId) {
            const normalized = dto.productId.trim().toLowerCase();
            const plan = plans_1.PRODUCT_ID_TO_PLAN[normalized] ??
                plans_1.PRODUCT_ID_TO_PLAN[dto.productId.trim()];
            if (plan)
                return plan;
        }
        throw new common_1.BadRequestException('Geçersiz istek. plan (WEEKLY | MONTHLY) veya geçerli bir productId gönderin.');
    }
    async purchase(firebaseUid, plan) {
        const config = plans_1.PLAN_CONFIG[plan];
        if (!config) {
            throw new common_1.BadRequestException('Geçersiz paket. WEEKLY veya MONTHLY olmalı.');
        }
        const user = await this.findOrCreateUser(firebaseUid);
        await this.resetCreditsIfExpired(user.id);
        const endsAt = new Date();
        endsAt.setDate(endsAt.getDate() + config.days);
        await this.prisma.userModel.update({
            where: { id: user.id },
            data: {
                creditsRemaining: config.credits,
                subscriptionPlan: plan,
                subscriptionEndsAt: endsAt,
            },
        });
        return this.getCredits(firebaseUid);
    }
};
exports.SubscriptionService = SubscriptionService;
exports.SubscriptionService = SubscriptionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SubscriptionService);
//# sourceMappingURL=subscription.service.js.map