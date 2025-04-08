import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {
  ConvertCurrencyDto,
  ConvertCurrencyResponseDto,
} from './dto/convert-currency.dto';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { FundWalletDto, FundWalletResponseDto } from './dto/fund-wallet.dto';
import { GetWalletDto } from './dto/get-currency.dto';
import { TradeDto } from './dto/trade.dto';
import { Wallet } from './wallet.entity';
import { SupportedCurrency } from './currency.enum';

@Controller('wallet')
export class WalletsController {
  constructor(private readonly walletService: WalletsService) {}

  @ApiOkResponse({ type: ConvertCurrencyResponseDto })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Post('convert')
  @ApiOperation({
    summary: 'Convert between currencies using real-time FX rates',
  })
  @ApiResponse({ status: 200, description: '' })
  async convertCurrency(@Req() req, @Body() dto: ConvertCurrencyDto) {
    const userId = req.user.id;
    return this.walletService.convert(userId, dto);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Post('trade')
  @ApiOperation({ summary: 'Trade Naira with other currencies and vice versa' })
  @ApiResponse({ status: 200, description: '' })
  async tradeCurrency(@Req() req, @Body() dto: TradeDto) {
    const userId = req.user.id;
    return this.walletService.trade(userId, dto);
  }

  @ApiOkResponse({ type: Wallet })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get('')
  @ApiOperation({ summary: 'Get user wallet balances by currency' })
  @ApiResponse({ status: 200, description: '' })
  async getWallet(
    @Req() req,
    @Query('currency') currency: SupportedCurrency, // Use @Query to get the currency from query parameters
  ) {
    return this.walletService.getWalletByUserIdAndCurrency(req.user.id, currency);
  }

  @ApiOkResponse({ type: FundWalletResponseDto })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Post('fund')
  @ApiOperation({ summary: 'Fund wallet in NGN or other currencies' })
  @ApiResponse({ status: 200, description: '' })
  async fundWallet(
    @Req() req,
    @Body()
    dto: FundWalletDto,
  ) {
    return this.walletService.fundWallet(req.user.id, dto);
  }
}
