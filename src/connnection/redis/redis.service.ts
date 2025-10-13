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
};