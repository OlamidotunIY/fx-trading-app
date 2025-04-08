import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Wallet } from './wallet.entity';
import { Repository } from 'typeorm';
import { SupportedCurrency } from './currency.enum';
import { CreateWalletDto } from './dto/createWallet.dto';
import { ConvertCurrencyDto } from './dto/convert-currency.dto';
import { FxRateService } from 'src/fx-rate/fx-rate.service';
import { FundWalletDto } from './dto/fund-wallet.dto';
import { TradeDto } from './dto/trade.dto';
import { TransactionsService } from 'src/transactions/transactions.service';

@Injectable()
export class WalletsService {
  constructor(
    @Inject('WALLET_REPO')
    private walletRepository: Repository<Wallet>,
    private readonly fxService: FxRateService,
    private readonly tsService: TransactionsService,
  ) {}

  async getWallets(userId: string) {
    return await this.walletRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
    });
  }

  async createDefaultWallet(userId: string) {
    for (const currency of Object.values(SupportedCurrency)) {
      const wallet = this.walletRepository.create({
        user: { id: userId }, // Assuming you have a way to set the user here
        balance: 0,
        currency: currency,
      });

      await this.walletRepository.save(wallet);
    }

    return await this.getWallets(userId);
  }

  async getWalletByUserIdAndCurrency(
    userId: string,
    currency: SupportedCurrency,
  ) {
    const wallet = await this.walletRepository.findOne({
      where: {
        user: {
          id: userId,
        },
        currency: currency,
      },
    });

    if (!wallet) {
      throw new BadRequestException('Wallet not found.');
    }

    return wallet;
  }

  async createWallet(dto: CreateWalletDto, userId: string) {
    const wallet = this.walletRepository.create({
      user: { id: userId },
      balance: 0,
      currency: dto.currency,
    });

    return await this.walletRepository.save(wallet);
  }

  async fundWallet(userId: string, { amount, currency }: FundWalletDto) {
    if (amount <= 0) {
      throw new BadRequestException('Amount must be greater than zero');
    }

    // Only allow NGN for now
    if (currency !== SupportedCurrency.NGN) {
      throw new BadRequestException('Only NGN funding is supported for now');
    }

    const wallet = await this.walletRepository.findOne({
      where: {
        user: {
          id: userId,
        },
        currency: currency,
      },
    });

    if (!wallet) {
      throw new BadRequestException('Wallet not found.');
    }
    wallet.balance = wallet.balance + amount;

    await this.walletRepository.save(wallet);
    await this.tsService.createFundTransaction(userId, {
      amount,
      currency,
    });

    return {
      message: 'Wallet funded successfully',
      balance: wallet.balance,
    };
  }

  async convert(
    userId: string,
    { fromCurrency, toCurrency, amount }: ConvertCurrencyDto,
  ) {
    const fromWallet = await this.walletRepository.findOne({
      where: {
        user: {
          id: userId,
        },
        currency: fromCurrency,
      },
    });
    const toWallet = await this.walletRepository.findOne({
      where: {
        user: {
          id: userId,
        },
        currency: toCurrency,
      },
    });

    if (!fromWallet || fromWallet.balance < amount) {
      throw new BadRequestException(
        'Insufficient balance or wallet not found.',
      );
    }

    const rate = await this.fxService.getRate(fromCurrency, toCurrency); // From Redis
    const convertedAmount = amount / rate.fromRate;

    console.log(rate, convertedAmount)

    fromWallet.balance -= amount;
    toWallet.balance += convertedAmount;

    await this.walletRepository.save([fromWallet, toWallet]);
    await this.tsService.createConvertTransaction(userId, {
      amount,
      fromCurrency,
      toCurrency,
      rate: rate.fromRate,
    });

    return {
      message: 'Currency converted successfully',
      convertedAmount: convertedAmount,
      rate: rate.fromRate,
    };
  }

  async trade(
    userId: string,
    { action, currency, amount, paymentCurrency }: TradeDto,
  ) {
    const rate = await this.fxService.getRate(paymentCurrency, currency);

    const valueInPayCurrency = amount * rate.toRate;

    if (action === 'buy') {
      const payWallet = await this.walletRepository.findOne({
        where: {
          user: {
            id: userId,
          },
          currency: paymentCurrency,
        },
      });
      const receiveWallet = await this.walletRepository.findOne({
        where: {
          user: {
            id: userId,
          },
          currency,
        },
      });

      if (!payWallet || payWallet.balance < valueInPayCurrency) {
        throw new BadRequestException('Insufficient funds to buy currency.');
      }

      payWallet.balance -= valueInPayCurrency;
      receiveWallet.balance += amount;
      await this.walletRepository.save([payWallet, receiveWallet]);
      await this.tsService.createTradeTransaction(userId, {
        amount,
        fromCurrency: paymentCurrency,
        toCurrency: currency,
       rate: rate.toRate,
      });

      return {
        message: 'Buy successful',
        amount,
        cost: valueInPayCurrency,
        rate: rate.toRate,
      };
    } else {
      // Sell
      const sellWallet = await this.walletRepository.findOne({
        where: {
          user: {
            id: userId,
          },
          currency,
        },
      });
      const receiveWallet = await this.walletRepository.findOne({
        where: {
          user: {
            id: userId,
          },
          currency: paymentCurrency,
        },
      });

      if (!sellWallet || sellWallet.balance < amount) {
        throw new BadRequestException('Insufficient currency to sell.');
      }

      sellWallet.balance -= amount;
      receiveWallet.balance += valueInPayCurrency;
      await this.walletRepository.save([sellWallet, receiveWallet]);
      await this.tsService.createTradeTransaction(userId, {
        amount,
        fromCurrency: paymentCurrency,
        toCurrency: currency,
        rate : rate.fromRate,
      });

      return { message: 'Sell successful', proceeds: valueInPayCurrency, rate: rate.toRate };
    }
  }
}
