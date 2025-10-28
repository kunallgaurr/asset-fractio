import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { RedisService } from "src/connection/redis";
import { constants, HttpResponse } from "src/utils";

@Injectable()
export class RateLimiter implements NestMiddleware {
  constructor(private readonly redisService: RedisService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const endpoint = req.originalUrl.split('?')[0].split('/').slice(1).join(':');
    const key = `rate:${endpoint}:${req.ip}`;
    const limit = constants.GLOBAL_LIMIT_THRESHOLD || 100; // fallback default
    const windowInSeconds = 3600; // 1 hour

    // const current = await this.redisService.incr(key);

    // if (current === 1) {
      // First hit, set expiration
      // await this.redisService.expire(key, windowInSeconds);
    // }

    // if (current > limit) {
    //   return res.status(200).json(HttpResponse.tooManyRequests()); // Use proper status code
    // }

    next();
  }
}
