import { IsEnum } from 'class-validator';
import { SupportedCurrency } from '../currency.enum';
import { ApiProperty } from '@nestjs/swagger';

export class GetWalletDto {
  @ApiProperty({
    enum: SupportedCurrency,
    enumName: 'SupportedCurrency',
    example: SupportedCurrency.USD,
  })
  @IsEnum(SupportedCurrency, { message: 'Invalid currency selected' })
  currency: SupportedCurrency;
}
