import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { JwtService } from '@nestjs/jwt';
import { otpProviders } from './otp.provider';
import { DatabaseModule } from 'src/database/database.module';
import { userProviders } from 'src/user/user.providers';
import { EmailService } from 'src/mailer/mailer.service';

@Module({
  imports: [DatabaseModule],
  providers: [...otpProviders, ...userProviders, OtpService, EmailService],
  exports: [...otpProviders]
})
export class OtpModule {}
