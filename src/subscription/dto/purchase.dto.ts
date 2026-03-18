import { IsIn, IsString, ValidateIf } from 'class-validator';
import { PLAN_VALUES } from '../constants/plans';

export class PurchaseSubscriptionDto {
  @ValidateIf((o: PurchaseSubscriptionDto) => !o.productId?.trim())
  @IsIn(PLAN_VALUES, {
    message: 'Plan must be WEEKLY or MONTHLY',
  })
  plan?: 'WEEKLY' | 'MONTHLY';

  @ValidateIf((o: PurchaseSubscriptionDto) => !o.plan)
  @IsString()
  productId?: string;
}
