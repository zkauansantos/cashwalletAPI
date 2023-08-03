import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { TransactionsRepository } from 'src/shared/database/repositories/transactions.respositories';
import { BankAccountsRepository } from 'src/shared/database/repositories/bank-accounts.repositories';
import { ValidateBankAccountOwnerService } from 'src/modules/bank-accounts/services/validate-bank-account-owner.service';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly bankAccountsRepository: BankAccountsRepository,
    private readonly transactionsRepository: TransactionsRepository,
    private readonly validateBankAccountOwnerService: ValidateBankAccountOwnerService,
  ) {}

  async create(userId: string, createTransactionDto: CreateTransactionDto) {
    const { bankAccountId, receivingUsername, value } = createTransactionDto;

    await this.validateEntitiesOwnership({
      userId,
      bankAccountId,
    });

    const { id: creditedBankAccountId } =
      await this.bankAccountsRepository.findFirst({
        where: {
          user: {
            username: receivingUsername,
          },
        },
        select: {
          id: true,
        },
      });

    if (!creditedBankAccountId) {
      throw new NotFoundException('User receiving not found.');
    }

    const userBalance = await this.bankAccountsRepository.findFirst({
      where: {
        id: bankAccountId,
        userId,
      },
      select: {
        balance: true,
      },
    });

    if (userBalance.balance < value) {
      throw new BadRequestException('User does not have enough balance.');
    }

    await this.transactionsRepository.create({
      data: {
        value,
        userId,
        bankAccountId,
        debitedBankAccountId: bankAccountId,
        creditedBankAccountId,
      },
    });

    await this.bankAccountsRepository.update({
      where: {
        id: bankAccountId,
      },
      data: {
        balance: {
          decrement: value,
        },
      },
    });

    await this.bankAccountsRepository.update({
      where: {
        id: creditedBankAccountId,
      },
      data: {
        balance: {
          increment: value,
        },
      },
    });

    return null;
  }

  // findAllByUserId(bankAccountId: string) {
  //   return this.transactionsRepository.findMany({
  //     where: {
  //       bankAccountId,
  //     },
  //   });
  // }

  private async validateEntitiesOwnership({
    userId,
    bankAccountId,
  }: {
    userId: string;
    bankAccountId: string;
  }) {
    await Promise.all([
      this.validateBankAccountOwnerService.validate(bankAccountId, userId),
    ]);
  }
}
