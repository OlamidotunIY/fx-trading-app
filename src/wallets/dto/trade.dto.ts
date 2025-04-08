import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsIn, IsEnum } from 'class-validator';
import { SupportedCurrency } from '../currency.enum';

export class TradeDto {
  @ApiProperty({ description: 'Trade action' })
  @IsIn(['buy', 'sell'])
  action: 'buy' | 'sell';

  @ApiProperty({
    enum: SupportedCurrency,
    enumName: 'SupportedCurrency',
    example: SupportedCurrency.USD,
  })
  @IsEnum(SupportedCurrency, { message: 'Invalid currency selected' })
  currency: SupportedCurrency;

  @ApiProperty({ description: 'amount to trade' })
  @IsNumber({}, { message: 'Amount must be a number' })
  amount: number;

  @ApiProperty({ description: 'wallet currency' })
  @IsEnum(SupportedCurrency, { message: 'Invalid currency selected' })
  paymentCurrency: SupportedCurrency; // e.g. NGN
}
