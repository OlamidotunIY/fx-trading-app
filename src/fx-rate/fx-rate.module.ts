import { Module } from '@nestjs/common';
import { FxRateService } from './fx-rate.service';
import { RedisService } from 'src/redis/redis.service';
import { FxRateController } from './fx-rate.controller';

@Module({
  providers: [FxRateService, RedisService],
  controllers: [FxRateController]
})
export class FxRateModule {}
