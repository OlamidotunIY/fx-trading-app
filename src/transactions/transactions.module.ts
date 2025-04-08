import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { transactionProviders } from './transactionProvider';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [...transactionProviders, TransactionsService],
  controllers: [TransactionsController],
  exports: [...transactionProviders],
})
export class TransactionsModule {}
