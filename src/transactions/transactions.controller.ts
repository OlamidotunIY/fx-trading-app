import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Transaction } from './transaction.entity';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @ApiOkResponse({ type: [Transaction] })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get('')
  @ApiOperation({ summary: 'View transaction history' })
  @ApiResponse({ status: 200, description: '' })
  async getTransactions(@Req() req) {
    return this.transactionsService.getTransactions(req.user.id);
  }
}
