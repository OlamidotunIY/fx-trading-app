import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Transaction } from './transaction.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @Inject('TS_REPO')
    private tsRepository: Repository<Transaction>,
  ) {}

  async getTransactions(userId: string) {
    return await this.tsRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
    });
  }

  async createFundTransaction(
    userId: string,
    dto: {
      amount: number;
      currency: string;
    },
  ) {
    const transaction = this.tsRepository.create({
      user: { id: userId },
      amount: dto.amount,
      type: 'FUND',
      status: 'SUCCESS',
      toCurrency: dto.currency,
      fromCurrency: 'NGN',
      rateUsed: 1,
    });

    return await this.tsRepository.save(transaction);
  }

  async createConvertTransaction(
    userId: string,
    dto: {
      amount: number;
      fromCurrency: string;
      toCurrency: string;
      rate: number;
    },
  ) {
    const transaction = this.tsRepository.create({
      user: { id: userId },
      amount: dto.amount,
      type: 'CONVERT',
      status: 'SUCCESS',
      toCurrency: dto.toCurrency,
      fromCurrency: dto.fromCurrency,
      rateUsed: dto.rate,
    });

    return await this.tsRepository.save(transaction);
  }

  async createTradeTransaction(
    userId: string,
    dto: {
      amount: number;
      fromCurrency: string;
      toCurrency: string;
      rate: number;
    },
  ) {
    const transaction = this.tsRepository.create({
      user: { id: userId },
      amount: dto.amount,
      type: 'TRADE',
      status: 'SUCCESS',
      toCurrency: dto.toCurrency,
      fromCurrency: dto.fromCurrency,
      rateUsed: dto.rate,
    });

    return await this.tsRepository.save(transaction);
  }
}
