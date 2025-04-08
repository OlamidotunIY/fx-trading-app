import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { OtpService } from 'src/otp/otp.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule } from '@nestjs/config';
import { userProviders } from 'src/user/user.providers';
import { DatabaseModule } from 'src/database/database.module';
import { otpProviders } from 'src/otp/otp.provider';
import { EmailService } from 'src/mailer/mailer.service';
import { jwtConstants } from 'src/constant/jwtConstant';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { UserService } from 'src/user/user.service';
import { WalletsService } from 'src/wallets/wallets.service';
import { walletProviders } from 'src/wallets/wallet.provider';
import { FxRateService } from 'src/fx-rate/fx-rate.service';
import { TransactionsService } from 'src/transactions/transactions.service';
import { RedisService } from 'src/redis/redis.service';
import { transactionProviders } from 'src/transactions/transactionProvider';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1hr' },
    }),
    DatabaseModule,
  ],
  controllers: [AuthController],
  providers: [
    ...userProviders,
    ...otpProviders,
    ...walletProviders,
    ...transactionProviders,
    AuthService,
    OtpService,
    JwtStrategy,
    EmailService,
    LocalStrategy,
    JwtService,
    UserService,
    WalletsService,
    FxRateService,
    TransactionsService,
    RedisService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
