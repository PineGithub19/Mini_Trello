import { Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
    private client: Redis;

    constructor() {
        this.client = new Redis({
            host: process.env.REDIS_HOST || 'localhost',
            port: Number(process.env.REDIS_PORT) || 6379,
            password: process.env.REDIS_PASSWORD,
        });
    }

    async set(key: string, value: any, ttlSeconds?: number) {
        const data = JSON.stringify(value);
        if (ttlSeconds) {
            await this.client.set(key, data, 'EX', ttlSeconds);
        } else {
            await this.client.set(key, data);
        }
    }

    async get<T>(key: string): Promise<T | null> {
        const data = await this.client.get(key);
        return data ? JSON.parse(data) : null;
    }

    async del(key: string) {
        await this.client.del(key);
    }

    async exists(key: string) {
        return this.client.exists(key);
    }

    getClient() {
        return this.client;
    }

    async onModuleDestroy() {
        await this.client.quit();
    }
}
