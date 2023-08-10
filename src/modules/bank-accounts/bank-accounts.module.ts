import { Module } from '@nestjs/common';
import { ValidateBankAccountOwnerService } from './services/validate-bank-account-owner.service';

@Module({
  controllers: [],
  providers: [ValidateBankAccountOwnerService],
  exports: [ValidateBankAccountOwnerService],
})
export class BankAccountsModule {}
