import { Module } from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { WalletsController } from './wallets.controller';
import { DatabaseModule } from 'src/database/database.module';
import { walletProviders } from './wallet.provider';
import { FxRateService } from 'src/fx-rate/fx-rate.service';
import { RedisService } from 'src/redis/redis.service';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { UserService } from 'src/user/user.service';
import { userProviders } from 'src/user/user.providers';
import { TransactionsService } from 'src/transactions/transactions.service';
import { transactionProviders } from 'src/transactions/transactionProvider';

@Module({
  imports: [DatabaseModule],
  providers: [...walletProviders, ...userProviders, ...transactionProviders, WalletsService, FxRateService, RedisService, JwtStrategy, UserService, TransactionsService],
  controllers: [WalletsController],
  exports: [...walletProviders]
})
export class WalletsModule {}
