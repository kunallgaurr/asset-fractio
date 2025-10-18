import { Inject, Injectable } from "@nestjs/common";
import type { RedisClientType } from "redis";
import { constants } from "src/utils";

@Injectable()
export class RedisService {
    constructor(
        @Inject(constants.PROVIDERS.REDIS_CONNECTION)
        private readonly client: RedisClientType
    ) {}

    // SET 
    async sAdd(key: string, members: string, expiry?: number) {
        return await Promise.all([
            this.client.sAdd(key, members),
            expiry ? this.client.expire(key, expiry) : null
        ]);
    }

    async sMembers(key: string) {
        return await this.client.sMembers(key)
    }

    async sIsMember(key: string, member: string) {
        return await this.client.sIsMember(key, member)
    }

    // Hash
    async hSet(key: string, field: string, value: string, expiry?: number) {
        return await Promise.all([
            this.client.hSet(key, field, value),
            expiry ? this.client.expire(key, expiry) : null
        ]);
    }

    async hSetAll(key: string, obj: Record<string, any>, expiry?: number) {
        return await Promise.all([
            this.client.hSet(key, obj),
            expiry ? this.client.expire(key, expiry) : null
        ]);
    }

    async hGet(key: string, field: string) {
        return await this.client.hGet(key, field);
    }

    async hGetAll(key: string) {
        return await this.client.hGetAll(key);
    }

    //string
    async set(key: string, value: string, expiry: number) {
        return await Promise.all([
            this.client.set(key, value),
            expiry ? this.client.expire(key, expiry) : null
        ])
    }

    async get(key: string) {
        return await this.client.get(key);
    }
};