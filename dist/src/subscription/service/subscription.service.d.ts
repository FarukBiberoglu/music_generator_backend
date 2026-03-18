import { PrismaService } from '../../prisma/prisma.service';
import { type PlanType } from '../constants/plans';
export declare class SubscriptionService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private findOrCreateUser;
    private resetCreditsIfExpired;
    getCredits(firebaseUid: string): Promise<{
        creditsRemaining: number;
        subscriptionPlan: PlanType | null;
        subscriptionEndsAt: Date | null;
    }>;
    consumeCredit(firebaseUid: string): Promise<{
        id: string;
        firebaseUid: string;
        createdAt: Date;
        creditsRemaining: number;
        subscriptionPlan: import("@prisma/client").$Enums.SubscriptionPlan | null;
        subscriptionEndsAt: Date | null;
    }>;
    refundCredit(firebaseUid: string): Promise<void>;
    resolvePlan(dto: {
        plan?: PlanType;
        productId?: string;
    }): PlanType;
    purchase(firebaseUid: string, plan: PlanType): Promise<{
        creditsRemaining: number;
        subscriptionPlan: PlanType | null;
        subscriptionEndsAt: Date | null;
    }>;
}
