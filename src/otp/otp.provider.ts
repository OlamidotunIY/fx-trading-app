
import { DataSource } from 'typeorm';
import { OTP } from './otp.entity';

export const otpProviders = [
  {
    provide: 'OTP_REPO',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(OTP),
    inject: ['DATA_SOURCE'],
  },
];