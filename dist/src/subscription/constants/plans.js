"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PRODUCT_ID_TO_PLAN = exports.PLAN_VALUES = exports.PLAN_CONFIG = exports.MONTHLY_DAYS = exports.MONTHLY_CREDITS = exports.WEEKLY_DAYS = exports.WEEKLY_CREDITS = void 0;
exports.WEEKLY_CREDITS = 20;
exports.WEEKLY_DAYS = 7;
exports.MONTHLY_CREDITS = 80;
exports.MONTHLY_DAYS = 30;
exports.PLAN_CONFIG = {
    WEEKLY: { credits: exports.WEEKLY_CREDITS, days: exports.WEEKLY_DAYS },
    MONTHLY: { credits: exports.MONTHLY_CREDITS, days: exports.MONTHLY_DAYS },
};
exports.PLAN_VALUES = ['WEEKLY', 'MONTHLY'];
exports.PRODUCT_ID_TO_PLAN = {
    weekly: 'WEEKLY',
    monthly: 'MONTHLY',
    pro_access_weekly: 'WEEKLY',
    pro_access_monthly: 'MONTHLY',
    'pro_access.weekly': 'WEEKLY',
    'pro_access.monthly': 'MONTHLY',
    ['$rc_weekly']: 'WEEKLY',
    ['$rc_monthly']: 'MONTHLY',
};
//# sourceMappingURL=plans.js.map