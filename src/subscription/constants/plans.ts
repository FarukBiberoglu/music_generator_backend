export type PlanType = 'WEEKLY' | 'MONTHLY';

export const WEEKLY_CREDITS = 20;
export const WEEKLY_DAYS = 7;

export const MONTHLY_CREDITS = 80;
export const MONTHLY_DAYS = 30;

export const PLAN_CONFIG: Record<PlanType, { credits: number; days: number }> =
  {
    WEEKLY: { credits: WEEKLY_CREDITS, days: WEEKLY_DAYS },
    MONTHLY: { credits: MONTHLY_CREDITS, days: MONTHLY_DAYS },
  };

export const PLAN_VALUES: PlanType[] = ['WEEKLY', 'MONTHLY'];

export const PRODUCT_ID_TO_PLAN: Record<string, PlanType> = {
  weekly: 'WEEKLY',
  monthly: 'MONTHLY',
  pro_access_weekly: 'WEEKLY',
  pro_access_monthly: 'MONTHLY',
  'pro_access.weekly': 'WEEKLY',
  'pro_access.monthly': 'MONTHLY',
  ['$rc_weekly']: 'WEEKLY',
  ['$rc_monthly']: 'MONTHLY',
};
