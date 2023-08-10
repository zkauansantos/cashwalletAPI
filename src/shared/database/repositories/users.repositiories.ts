import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { type Prisma } from '@prisma/client';

@Injectable()
export class UsersRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(createDto: Prisma.UserCreateArgs) {
    return this.prismaService.user.create(createDto);
  }

  findUnique<T extends Prisma.UserFindUniqueArgs>(
    findUniqueDto: Prisma.SelectSubset<T, Prisma.UserFindUniqueArgs>,
  ) {
    return this.prismaService.user.findUnique(findUniqueDto);
  }
}
