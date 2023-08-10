import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UsersRepository } from './repositories/users.repositiories';
import { TransactionsRepository } from './repositories/transactions.respositories';
import { BankAccountsRepository } from './repositories/bank-accounts.repositories';
@Global()
@Module({
  providers: [
    PrismaService,
    UsersRepository,
    TransactionsRepository,
    BankAccountsRepository,
  ],
  exports: [UsersRepository, TransactionsRepository, BankAccountsRepository],
})
export class DatabaseModule {}
