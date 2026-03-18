import {
  Injectable,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  PLAN_CONFIG,
  PRODUCT_ID_TO_PLAN,
  type PlanType,
} from '../constants/plans';

@Injectable()
export class SubscriptionService {
  constructor(private readonly prisma: PrismaService) {}

  private async findOrCreateUser(firebaseUid: string) {
    const existing = await this.prisma.userModel.findUnique({
      where: { firebaseUid },
    });
    if (existing) return existing;

    try {
      return await this.prisma.userModel.create({
        data: { firebaseUid },
      });
    } catch (e: unknown) {
      const isUniqueViolation =
        e &&
        typeof e === 'object' &&
        'code' in e &&
        (e as { code: string }).code === 'P2002';
      if (isUniqueViolation) {
        return this.prisma.userModel.findUniqueOrThrow({
          where: { firebaseUid },
        });
      }
      throw e;
    }
  }

  private async resetCreditsIfExpired(userId: string) {
    const user = (await this.prisma.userModel.findUnique({
      where: { id: userId },
      select: { subscriptionEndsAt: true, creditsRemaining: true },
    })) as { subscriptionEndsAt: Date | null; creditsRemaining: number } | null;
    if (!user?.subscriptionEndsAt) return;
    const now = new Date();
    if (user.subscriptionEndsAt.getTime() > now.getTime()) return;
    await this.prisma.userModel.update({
      where: { id: userId },
      data: {
        creditsRemaining: 0,
        subscriptionPlan: null,
        subscriptionEndsAt: null,
      },
    });
  }

  async getCredits(firebaseUid: string): Promise<{
    creditsRemaining: number;
    subscriptionPlan: PlanType | null;
    subscriptionEndsAt: Date | null;
  }> {
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
      subscriptionPlan: updated.subscriptionPlan as PlanType | null,
      subscriptionEndsAt: updated.subscriptionEndsAt,
    };
  }

  async consumeCredit(firebaseUid: string) {
    const user = await this.findOrCreateUser(firebaseUid);
    await this.resetCreditsIfExpired(user.id);
    const current = await this.prisma.userModel.findUniqueOrThrow({
      where: { id: user.id },
      select: { creditsRemaining: true, subscriptionEndsAt: true },
    });
    if (
      current.creditsRemaining < 1 ||
      (current.subscriptionEndsAt && current.subscriptionEndsAt <= new Date())
    ) {
      throw new ForbiddenException(
        'Yeterli krediniz yok veya aboneliğiniz sona erdi. Lütfen paket satın alın.',
      );
    }
    await this.prisma.userModel.update({
      where: { id: user.id },
      data: { creditsRemaining: { decrement: 1 } },
    });
    return this.prisma.userModel.findUniqueOrThrow({
      where: { id: user.id },
    });
  }

  async refundCredit(firebaseUid: string) {
    const user = await this.findOrCreateUser(firebaseUid);
    await this.resetCreditsIfExpired(user.id);
    const current = await this.prisma.userModel.findUniqueOrThrow({
      where: { id: user.id },
      select: { subscriptionEndsAt: true },
    });
    if (
      current.subscriptionEndsAt &&
      current.subscriptionEndsAt <= new Date()
    ) {
      return;
    }
    await this.prisma.userModel.update({
      where: { id: user.id },
      data: { creditsRemaining: { increment: 1 } },
    });
  }

  resolvePlan(dto: { plan?: PlanType; productId?: string }): PlanType {
    if (dto.plan && PLAN_CONFIG[dto.plan]) return dto.plan;
    if (dto.productId) {
      const normalized = dto.productId.trim().toLowerCase();
      const plan =
        PRODUCT_ID_TO_PLAN[normalized] ??
        PRODUCT_ID_TO_PLAN[dto.productId.trim()];
      if (plan) return plan;
    }
    throw new BadRequestException(
      'Geçersiz istek. plan (WEEKLY | MONTHLY) veya geçerli bir productId gönderin.',
    );
  }

  async purchase(firebaseUid: string, plan: PlanType) {
    const config = PLAN_CONFIG[plan];
    if (!config) {
      throw new BadRequestException(
        'Geçersiz paket. WEEKLY veya MONTHLY olmalı.',
      );
    }
    const user = await this.findOrCreateUser(firebaseUid);
    await this.resetCreditsIfExpired(user.id);
    const endsAt = new Date();
    endsAt.setDate(endsAt.getDate() + config.days);
    await this.prisma.userModel.update({
      where: { id: user.id },
      data: {
        creditsRemaining: config.credits,
        subscriptionPlan: plan as 'WEEKLY' | 'MONTHLY',
        subscriptionEndsAt: endsAt,
      },
    });
    return this.getCredits(firebaseUid);
  }
}
