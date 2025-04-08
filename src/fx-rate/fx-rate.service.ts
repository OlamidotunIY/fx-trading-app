import {
  Injectable,
  Logger,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RedisService } from 'src/redis/redis.service';

// Custom Error class for Exchange API errors
class FxRateApiError extends InternalServerErrorException {
  constructor(message: string) {
    super(message, 'FX_RATE_API_ERROR');
  }
}

// Custom Error class for Cache related issues
class FxRateCacheError extends NotFoundException {
  constructor(message: string) {
    super(message, 'FX_RATE_CACHE_ERROR');
  }
}

@Injectable()
export class FxRateService {
  private readonly logger = new Logger(FxRateService.name);
  private readonly fxApiUrl =
    'https://v6.exchangerate-api.com/v6/d7e3fa362de203c666e83ed7/latest/USD';

  constructor(private readonly redis: RedisService) {}

  // Fetch real-time FX rates from the external API
  async fetchFxRates() {
    try {
      const response = await fetch(this.fxApiUrl);

      // Check if response is OK
      if (!response.ok) {
        this.logger.error(
          `Failed to fetch FX rates. Status: ${response.status}`,
        );
        throw new FxRateApiError('Failed to fetch FX rates from external API.');
      }

      const data = await response.json();
      if (data && data.conversion_rates) {
        const rates = data.conversion_rates;

        // Store FX rates in Redis cache (set with an expiration time of 1 hour)
        await this.redis.set('fxRates', JSON.stringify(rates), 3600);
        this.logger.log('FX rates fetched and cached in Redis.');
        return rates;
      } else {
        this.logger.error('No conversion rates found in the API response.');
        throw new FxRateApiError('No conversion rates found in API response.');
      }
    } catch (error) {
      if (error instanceof FxRateApiError) {
        // Already handled in a custom error class
        this.logger.error(`FX Rate API Error: ${error.message}`);
      } else {
        // Unexpected errors
        this.logger.error('Unexpected error fetching FX rates', error.stack);
        throw new FxRateApiError(
          'Unexpected error occurred while fetching FX rates.',
        );
      }
    }
  }

  // Convert currency using Redis cached data
  async convertCurrency(
    amount: number,
    fromCurrency: string,
    toCurrency: string,
  ) {
    // Retrieve rates from Redis cache
    const cachedRates = await this.redis.get('fxRates');

    let rates;
    if (cachedRates) {
      rates = JSON.parse(cachedRates);
      this.logger.log('FX rates fetched from cache.');
    } else {
      // If cache is empty, fetch from the API
      this.logger.log('FX rates not found in cache. Fetching from API...');
      rates = await this.fetchFxRates();
    }

    const fromRate = rates[fromCurrency];
    const toRate = rates[toCurrency];
    if (fromRate && toRate) {
      // Convert the amount to base currency
      const amountInBaseCurrency = amount / fromRate;

      // Convert from base currency to the target currency (NGN)
      const convertedAmount = amountInBaseCurrency * toRate;

      return {
        convertedAmount,
        rate: toRate, // The rate showing how many NGN you get for 1 USD
      };
    } else {
      throw new FxRateCacheError(
        'Currency rates for the specified currencies are not available.',
      );
    }
  }

  // Method to refresh FX rates every hour
  @Cron(CronExpression.EVERY_10_MINUTES)
  async refreshFxRates() {
    this.logger.log('Refreshing FX rates...');
    try {
      await this.fetchFxRates();
    } catch (error) {
      this.logger.error('Error refreshing FX rates', error.stack);
    }
  }

  // Retrieve FX rates from cache or API if not cached
  async getFxRates() {
    const cachedRates = await this.redis.get('fxRates');
    if (cachedRates) {
      this.logger.log('FX rates fetched from cache.');
      return JSON.parse(cachedRates);
    } else {
      this.logger.log('FX rates not found in cache. Fetching from API...');
      return await this.fetchFxRates();
    }
  }

  async getRate(fromCurrency: string, toCurrency: string) {
    const rates = await this.getFxRates();

    const fromRate = rates[fromCurrency];
    const toRate = rates[toCurrency];

    if (!fromRate || !toRate) {
      throw new FxRateCacheError(
        `Currency rates for ${fromCurrency} or ${toCurrency} are not available.`,
      );
    }

    // Calculate the rate from `fromCurrency` to `toCurrency`
    const rate = fromRate / toRate
    return {
      fromRate,
      toRate
    };
  }
}
