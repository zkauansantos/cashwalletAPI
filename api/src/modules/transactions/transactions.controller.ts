import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { TransactionsService } from './services/transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { ActiveUserId } from 'src/shared/decorators/activeUserId.decorator';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  create(
    @ActiveUserId() userId: string,
    @Body() createTransactionDto: CreateTransactionDto,
  ) {
    return this.transactionsService.create(userId, createTransactionDto);
  }

  @Get()
  findAll(
    @ActiveUserId() userId: string,
    @Query('bankAccountId') bankAccountId?: string,
  ) {
    return this.transactionsService.findAllByUserId(userId, bankAccountId);
  }
}
