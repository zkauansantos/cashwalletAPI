import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { TransactionsService } from './services/transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { ActiveUserId } from 'src/shared/decorators/activeUserId.decorator';
import { TransactionFilter } from './entities/TransactionType';
import { OptinalParseEnumPipe } from 'src/shared/pipes/OptionalParseEnumPipe.pipe';

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
    @Query('bankAccountId', ParseUUIDPipe) bankAccountId: string,
    @Query('filter', new OptinalParseEnumPipe(TransactionFilter))
    filter?: TransactionFilter,
  ) {
    return this.transactionsService.findAllByBankAccountId(
      userId,
      bankAccountId,
      filter,
    );
  }
}
