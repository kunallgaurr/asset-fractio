import { NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

export class LoggerMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const date = new Date();

        console.log(
            `method: ${req.method}; path: ${req.baseUrl}; at: ${date.toLocaleTimeString()} ${date.toDateString()}`
        )

        next();
    }
}