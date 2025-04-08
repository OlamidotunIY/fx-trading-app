import { IsEnum, IsNumber, IsString } from 'class-validator';
import { SupportedCurrency } from '../currency.enum';
import { ApiProperty } from '@nestjs/swagger';

export class ConvertCurrencyDto {
  @ApiProperty({
    description: '',
    enum: SupportedCurrency,
    enumName: 'SupportedCurrency',
    example: SupportedCurrency.NGN,
  })
  @IsEnum(SupportedCurrency, { message: 'Invalid currency selected' })
  fromCurrency: SupportedCurrency;

  @ApiProperty({
    description: '',
    enum: SupportedCurrency,
    enumName: 'SupportedCurrency',
    example: SupportedCurrency.USD,
  })
  @IsEnum(SupportedCurrency, { message: 'Invalid currency selected' })
  toCurrency: SupportedCurrency;

  @ApiProperty({ description: '' })
  @IsNumber()
  amount: number;
}

export class ConvertCurrencyResponseDto {
  @ApiProperty()
  @IsString()
  message: string;

  @ApiProperty()
  @IsNumber()
  convertedAmount: number;

  @ApiProperty()
  @IsNumber()
  rate: number;
}