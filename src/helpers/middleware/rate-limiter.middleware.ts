import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { RedisService } from "src/connection";
import { constants, HttpResponse } from "src/utils";

@Injectable()
export class RateLimiter implements NestMiddleware {
    constructor(
        private readonly redisService: RedisService
    ) {}
    
    async use(req: Request, res: Response, next: NextFunction) {
        const key = req.originalUrl.split('/').slice(1).join(':') + ':' + req.ip;

        const requests = await this.redisService.get(key);
        const count = Number(requests) + 1;
        if(count > constants.GLOBAL_LIMIT_THRESHOLD) {
            await this.redisService.set(key, count.toString(), 3600);
            return res.status(200).json(HttpResponse.tooManyRequests());
        }

        // Set with TTL of 1 hour (3600 seconds)
        await this.redisService.set(key, count.toString(), 3600);
        next();
    }
}