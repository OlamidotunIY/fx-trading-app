// src/auth/auth.service.ts
import { Injectable, BadRequestException, Inject, Body } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from './dto/register.dto';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { OtpService } from 'src/otp/otp.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { jwtConstants } from 'src/constant/jwtConstant';
import { WalletsService } from 'src/wallets/wallets.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_REPO')
    private userRepository: Repository<User>,
    private otpService: OtpService,
    private jwtService: JwtService,
    private walletService: WalletsService,
  ) {}

  async registerUser(dto: RegisterDto) {
    const userExists = await this.userRepository.findOne({
      where: { email: dto.email },
    });
    if (userExists) throw new BadRequestException('Email already exists');

    const hashed = await bcrypt.hash(dto.password, 10);
    const user = await this.userRepository.save({
      email: dto.email,
      password: hashed,
      name: dto.name,
      isVerified: false,
    });

    await this.walletService.createDefaultWallet(user.id);
    return this.otpService.sendOtp(user.email);
  }

  async validateUser(dto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
    });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) return null;

    return user;
  }

  async login(user: User) {
    const payload = { username: user.name, sub: user.id };
    return {
      access_token: this.jwtService.sign(
        {
          ...payload,
        },
        {
          secret: jwtConstants.secret,
        },
      ),
    };
  }
}
