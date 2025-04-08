import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { WalletsModule } from './wallets/wallets.module';
import { TransactionsModule } from './transactions/transactions.module';
import { OtpModule } from './otp/otp.module';
import { AuthController } from './auth/auth.controller';
import { OtpService } from './otp/otp.service';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { DatabaseModule } from './database/database.module';
import { EmailService } from './mailer/mailer.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RedisModule } from './redis/redis.module';
import { FxRateModule } from './fx-rate/fx-rate.module';
import { WalletsService } from './wallets/wallets.service';
import { FxRateService } from './fx-rate/fx-rate.service';
import { TransactionsService } from './transactions/transactions.service';
import { RedisService } from './redis/redis.service';

@Module({
  imports: [
    AuthModule,
    UserModule,
    WalletsModule,
    TransactionsModule,
    OtpModule,
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ClientsModule.register([
      {
        name: 'REDIS_SERVICE',
        transport: Transport.REDIS,
        options: {
          host: 'localhost',
          port: 6379,
        },
      },
    ]),
    RedisModule,
    FxRateModule,
  ],
  controllers: [AppController, AuthController],
  providers: [AppService, AuthService, OtpService, JwtService, EmailService, WalletsService, FxRateService, TransactionsService, RedisService],
})
export class AppModule {}
