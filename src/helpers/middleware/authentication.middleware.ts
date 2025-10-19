import { Injectable, NestMiddleware } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { NextFunction, Request, Response } from "express";
import { HttpResponse } from "src/utils";

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
    constructor(
        private readonly jwtService: JwtService
    ) { }

    use(req: Request, res: Response, next: NextFunction) {
        try {
            const authorizationHeader = req.headers['authorization'];
            if (!authorizationHeader) {
                return res.status(200).json(HttpResponse.unauthorized('Authorization header is missing.'));
            }

            // Extract token from "Bearer <token>" format
            const tokenParts = authorizationHeader.split(' ');
            if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
                return res.status(200).json(HttpResponse.unauthorized('Invalid authorization format. Expected "Bearer <token>".'));
            }

            const token = tokenParts[1];
            if (!token) {
                return res.status(200).json(HttpResponse.unauthorized('Token is missing.'));
            }

            // Verify and decode the JWT token
            const payload = this.jwtService.verify(token);

            // Validate payload structure
            if (!payload || !payload.id) {
                return res.status(200).json(HttpResponse.unauthorized('Invalid token payload.'));
            }

            // Extract user information from token payload
            const userId = payload.id;
            const userRole = payload.role || 'USER'; // Default role if not present

            // // Append user information to request object for use in controllers/services
            // req['user'] = {
            //     id: userId,
            //     role: userRole
            // };

            // Also append to query params for backward compatibility
            if (req.method === 'GET') {
                console.log('method is: ', req.method)
                if (!req.query.userId) {
                    console.log(req.query);
                    req.query.userId = userId.toString();
                    console.log(req.query);
                };
            }

            if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
                // Initialize req.body if it doesn't exist
                if (!req.body) {
                    req.body = {};
                }

                req.body.userId = userId;
            }

            req.query.userRole = userRole;

            console.log(`Authorized user - ID: ${userId}, Role: ${userRole}`);
            next();
        } catch (error) {
            // Handle JWT verification errors
            if (error.name === 'JsonWebTokenError') {
                return res.status(200).json(HttpResponse.unauthorized('Invalid token.'));
            } else if (error.name === 'TokenExpiredError') {
                return res.status(200).json(HttpResponse.unauthorized('Token has expired.'));
            } else {
                console.error('Authorization middleware error:', error);
                return res.status(200).json(HttpResponse.internalServerError('Authorization failed.'));
            }
        }
    }
}