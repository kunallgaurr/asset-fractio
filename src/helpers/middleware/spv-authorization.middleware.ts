import { Injectable, NestMiddleware } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { NextFunction, Request, Response } from "express";
import { UserRole } from "src/module/user";
import { HttpResponse } from "src/utils";

@Injectable()
export class SpvAuthorizationMiddleware implements NestMiddleware {

    use(req: Request, res: Response, next: NextFunction) {
        const role = req.query.userRole;

        if (!role) {
            return res.status(200).json(HttpResponse.unauthorized());
        }

        if (role !== UserRole.SPV) {
            return res.status(200).json(HttpResponse.unauthorized('You are not allowed to access this resource.'));

        }

        next();
    }
}