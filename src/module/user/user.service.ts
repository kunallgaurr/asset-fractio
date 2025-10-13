import { Injectable } from "@nestjs/common";
import { UserRepository } from "./user.repository";
import { TSignup } from "./user.dto";
import { RedisService } from "src/connnection";
import { constants, HttpResponse } from "src/utils";

@Injectable()
export class UserService {
    constructor(
        private readonly user: UserRepository,
        private readonly redisService: RedisService
    ) { }

    async signup(payload: TSignup) {
        try {
            const { username, email, countryCode, phoneNumber, password } = payload;

            const [usernameLookup, emailLookup] = await Promise.all([
                this.redisService.sIsMember(constants.REDIS_KEYS.USERNAME_SET, username),
                this.redisService.sIsMember(constants.REDIS_KEYS.EMAIL_SET, email),
            ]);

            if (!usernameLookup) return HttpResponse.badRequest('User is already taken.');
            if (!emailLookup) return HttpResponse.badRequest('Email is already registered.')

            Promise.all([
                this.user.save({ ...payload, phoneNumber: countryCode + phoneNumber, password: this.hashPassword(password) }),
                this.redisService.sAdd(constants.REDIS_KEYS.USERNAME_SET, username),
                this.redisService.sAdd(constants.REDIS_KEYS.EMAIL_SET, email)
            ]);

            return HttpResponse.success();
        } catch (error) {
            return HttpResponse.internalServerError();
        }
    }

    private hashPassword(password: string) {
        return password;
    }
}