import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { TransactionsRepository } from 'src/shared/database/repositories/transactions.respositories';
import { BankAccountsRepository } from 'src/shared/database/repositories/bank-accounts.repositories';
import { ValidateBankAccountOwnerService } from 'src/modules/bank-accounts/services/validate-bank-account-owner.service';
import { TransactionFilter } from '../entities/TransactionType';
import { UsersRepository } from 'src/shared/database/repositories/users.repositiories';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly bankAccountsRepository: BankAccountsRepository,
    private readonly transactionsRepository: TransactionsRepository,
    private readonly usersRepository: UsersRepository,
    private readonly validateBankAccountOwnerService: ValidateBankAccountOwnerService,
  ) {}

  async create(userId: string, createTransactionDto: CreateTransactionDto) {
    const { bankAccountId, receivingUsername, value } = createTransactionDto;

    await this.validateEntitiesOwnership({
      userId,
      bankAccountId,
    });

    const { balance, user } = await this.bankAccountsRepository.findFirst({
      where: {
        id: bankAccountId,
        userId,
      },
      select: {
        balance: true,
        user: {
          select: {
            username: true,
          },
        },
      },
    });

    if (balance < value) {
      throw new BadRequestException('User does not have enough balance.');
    }

    if (user.username === receivingUsername) {
      throw new BadRequestException(
        'Sending user cannot be the same as receiving.',
      );
    }

    const userReceiver = await this.findUserReceiverAndBankAccountId(
      receivingUsername,
    );

    await this.createTransactionAndUpdateBalances(
      bankAccountId,
      userReceiver.bankAccount.id,
      value,
    );

    return null;
  }

  async findAllByBankAccountId(
    userId: string,
    bankAccountId: string,
    filter: TransactionFilter,
  ) {
    await this.validateEntitiesOwnership({ userId, bankAccountId });

    const transactions = await this.bankAccountsRepository.findUnique({
      where: {
        id: bankAccountId,
      },
      select: {
        transactionsCredited: true,
        transactionsDebited: true,
      },
    });

    if (filter === 'CREDITED') {
      return transactions.transactionsCredited;
    }

    if (filter === 'DEBITED') {
      return transactions.transactionsDebited;
    }

    return [
      ...transactions.transactionsCredited,
      ...transactions.transactionsDebited,
    ];
  }

  private async validateEntitiesOwnership({
    userId,
    bankAccountId,
  }: {
    userId: string;
    bankAccountId: string;
  }) {
    await this.validateBankAccountOwnerService.validate(bankAccountId, userId);
  }

  private async findUserReceiverAndBankAccountId(username: string) {
    const userReceiver = await this.usersRepository.findUnique({
      where: {
        username,
      },
      include: {
        bankAccount: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!userReceiver) {
      throw new NotFoundException('User receiving not found.');
    }

    return userReceiver;
  }

  private async createTransactionAndUpdateBalances(
    debitedBankAccountId: string,
    creditedBankAccountId: string,
    value: number,
  ) {
    await this.transactionsRepository.create({
      data: {
        value,
        debitedBankAccountId: debitedBankAccountId,
        creditedBankAccountId: creditedBankAccountId,
      },
    });

    await this.bankAccountsRepository.update({
      where: {
        id: debitedBankAccountId,
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
  }
}
