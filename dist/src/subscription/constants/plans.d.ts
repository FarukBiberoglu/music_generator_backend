export type PlanType = 'WEEKLY' | 'MONTHLY';
export declare const WEEKLY_CREDITS = 20;
export declare const WEEKLY_DAYS = 7;
export declare const MONTHLY_CREDITS = 80;
export declare const MONTHLY_DAYS = 30;
export declare const PLAN_CONFIG: Record<PlanType, {
    credits: number;
    days: number;
}>;
export declare const PLAN_VALUES: PlanType[];
export declare const PRODUCT_ID_TO_PLAN: Record<string, PlanType>;
