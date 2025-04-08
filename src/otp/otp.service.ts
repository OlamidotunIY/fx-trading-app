import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { OTP } from './otp.entity';
import { Repository } from 'typeorm';
import { randomBytes } from 'crypto';
import * as dayjs from 'dayjs';
import { VerifyDto } from 'src/auth/dto/verify.dto';
import { User } from 'src/user/user.entity';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from 'src/mailer/mailer.service';

@Injectable()
export class OtpService {
  constructor(
    @Inject('OTP_REPO')
    private otpRepository: Repository<OTP>,
    @Inject('USER_REPO')
    private userRepository: Repository<User>,
    private mailerService: EmailService,
  ) {}

  async sendOtp(email: string) {
    const code = randomBytes(3).toString('hex').toUpperCase();
    const expiresAt = dayjs().add(10, 'minutes').toDate();

    const otp = this.otpRepository.create({
      code,
      email,
      expiresAt,
    });

    await this.otpRepository.save(otp);

    try {
      await this.mailerService.sendMail(
        email,
        'Your OTP Code',
        `<p>Your OTP code is <b>${code}</b>. It expires in 10 minutes.</p>`,
      );

      return {
        message: 'Email verification sent',
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Error sending OTP email. Please try again later.',
      );
    }
  }

  async verifyOtp(dto: VerifyDto) {
    const otp = await this.otpRepository.findOne({
      where: { email: dto.email, code: dto.code },
    });

    if (!otp) throw new BadRequestException('Invalid or expired OTP');

    await this.otpRepository.delete(otp.id);

    await this.userRepository.update(
      { email: dto.email },
      { isVerified: true },
    );

   return {
    message: "Email Verified Successfully"
   }
  }
}
