import { Controller, Get, UseGuards } from '@nestjs/common';
import { FxRateService } from './fx-rate.service';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('fx')
export class FxRateController {
  constructor(private readonly fxRateService: FxRateService) {}

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get('rates')
  @ApiOperation({
    summary: 'Retrieve current FX rates for supported currency pairs',
  })
  @ApiResponse({ status: 200, description: '' })
  async getFxRates() {
    return this.fxRateService.getFxRates();
  }
}
