// src/redis/redis.service.ts
import { Injectable } from '@nestjs/common';
import { Client, ClientProxy, Transport } from '@nestjs/microservices';
import Redis, { RedisKey } from 'ioredis';

@Injectable()
export class RedisService {

  private readonly redis = new Redis({
    host: 'localhost',  // Redis host
    port: 6379,         // Redis port
  });

  async set(key: RedisKey, value: string | Buffer | number, exp: number | string): Promise<void> {
    await this.redis.set(key, JSON.stringify(value), 'EX', exp);
  }

  async get(key: string): Promise<any> {
    const value = await this.redis.get(key);
    return value ? JSON.parse(value) : null;
  }
}
