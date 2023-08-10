import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { type Prisma } from '@prisma/client';

@Injectable()
export class BankAccountsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(createBankAccountDto: Prisma.BankAccountCreateArgs) {
    return this.prismaService.bankAccount.create(createBankAccountDto);
  }

  findUnique<T extends Prisma.BankAccountFindUniqueArgs>(
    findUniqueBankAccountDto: Prisma.SelectSubset<
      T,
      Prisma.BankAccountFindUniqueArgs
    >,
  ) {
    return this.prismaService.bankAccount.findUnique(findUniqueBankAccountDto);
  }

  findMany<T extends Prisma.BankAccountFindManyArgs>(
    findManyBankAccountDto: Prisma.SelectSubset<
      T,
      Prisma.BankAccountFindManyArgs
    >,
  ) {
    return this.prismaService.bankAccount.findMany(findManyBankAccountDto);
  }

  findFirst<T extends Prisma.BankAccountFindFirstArgs>(
    findFirstBankAccountDto: Prisma.SelectSubset<
      T,
      Prisma.BankAccountFindManyArgs
    >,
  ) {
    return this.prismaService.bankAccount.findFirst(findFirstBankAccountDto);
  }

  update(updateBankAccountDto: Prisma.BankAccountUpdateArgs) {
    return this.prismaService.bankAccount.update(updateBankAccountDto);
  }

  updateMany(updateManyBankAccountDto: Prisma.BankAccountUpdateManyArgs) {
    return this.prismaService.bankAccount.updateMany(updateManyBankAccountDto);
  }

  delete(deleteBankAccountDto: Prisma.BankAccountDeleteArgs) {
    return this.prismaService.bankAccount.delete(deleteBankAccountDto);
  }
}
