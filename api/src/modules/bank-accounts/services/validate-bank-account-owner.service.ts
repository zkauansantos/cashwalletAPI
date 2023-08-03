import { Injectable, NotFoundException } from '@nestjs/common';
import { BankAccountsRepository } from 'src/shared/database/repositories/bank-accounts.repositories';

@Injectable()
export class ValidateBankAccountOwnerService {
  constructor(
    private readonly bankAccountsRepository: BankAccountsRepository,
  ) {}

  public async validate(bankAccountId: string, userId: string) {
    const isOwner = await this.bankAccountsRepository.findFirst({
      where: { id: bankAccountId, userId },
    });

    if (!isOwner) {
      throw new NotFoundException('Bank Account not found.');
    }
  }
}
