import { SubscriptionService } from '../service/subscription.service';
import { PurchaseSubscriptionDto } from '../dto/purchase.dto';
export declare class SubscriptionController {
    private readonly subscriptionService;
    constructor(subscriptionService: SubscriptionService);
    getCredits(user: {
        uid: string;
    }): Promise<{
        creditsRemaining: number;
        subscriptionPlan: import("../constants/plans").PlanType | null;
        subscriptionEndsAt: Date | null;
    }>;
    purchase(user: {
        uid: string;
    }, dto: PurchaseSubscriptionDto): Promise<{
        creditsRemaining: number;
        subscriptionPlan: import("../constants/plans").PlanType | null;
        subscriptionEndsAt: Date | null;
    }>;
}
