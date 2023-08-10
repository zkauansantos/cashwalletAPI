import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class TransactionsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(createBankAccountDto: Prisma.TransactionCreateArgs) {
    return this.prismaService.transaction.create(createBankAccountDto);
  }

  findMany<T extends Prisma.TransactionFindManyArgs>(
    findAllBankAccountDto: Prisma.SelectSubset<
      T,
      Prisma.TransactionFindManyArgs
    >,
  ) {
    return this.prismaService.transaction.findMany(findAllBankAccountDto);
  }

  findFirst(findFirstBankAccountDto: Prisma.TransactionFindFirstArgs) {
    return this.prismaService.transaction.findFirst(findFirstBankAccountDto);
  }

  update(updateBankAccountDto: Prisma.TransactionUpdateArgs) {
    return this.prismaService.transaction.update(updateBankAccountDto);
  }

  delete(deleteBankAccountDto: Prisma.TransactionDeleteArgs) {
    return this.prismaService.transaction.delete(deleteBankAccountDto);
  }
}
