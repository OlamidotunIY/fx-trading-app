import { IsEnum, IsNumber, IsString } from 'class-validator';
import { SupportedCurrency } from '../currency.enum';
import { ApiProperty } from '@nestjs/swagger';

export class FundWalletDto {
  @ApiProperty({
    enum: SupportedCurrency,
    enumName: 'SupportedCurrency',
    example: SupportedCurrency.USD,
  })
  @IsEnum(SupportedCurrency, { message: 'Invalid currency selected' })
  currency: SupportedCurrency;

  @ApiProperty({ description: '' })
  @IsNumber()
  amount: number;
}

export class FundWalletResponseDto {
  @ApiProperty()
  @IsString()
  message: string;

  @ApiProperty()
  @IsNumber()
  balance: number;
}
