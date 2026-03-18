import { Controller, Delete, UseGuards } from '@nestjs/common';
import { FirebaseAuthGuard } from '../firebase/guards/firebase_auth_guard';
import { CurrentUser } from '../firebase/decorators/current-user.decorator';
import { AccountService } from './account.service';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Delete()
  @UseGuards(FirebaseAuthGuard)
  async deleteAccount(@CurrentUser() user: { uid: string }) {
    return this.accountService.deleteAccount(user.uid);
  }
}
