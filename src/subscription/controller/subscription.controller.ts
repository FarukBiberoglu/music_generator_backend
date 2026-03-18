import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { FirebaseAuthGuard } from '../../firebase/guards/firebase_auth_guard';
import { CurrentUser } from '../../firebase/decorators/current-user.decorator';
import { SubscriptionService } from '../service/subscription.service';
import { PurchaseSubscriptionDto } from '../dto/purchase.dto';

@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Get('credits')
  @UseGuards(FirebaseAuthGuard)
  async getCredits(@CurrentUser() user: { uid: string }) {
    return this.subscriptionService.getCredits(user.uid);
  }

  @Post('purchase')
  @UseGuards(FirebaseAuthGuard)
  async purchase(
    @CurrentUser() user: { uid: string },
    @Body() dto: PurchaseSubscriptionDto,
  ) {
    const plan = this.subscriptionService.resolvePlan(dto);
    return this.subscriptionService.purchase(user.uid, plan);
  }
}
