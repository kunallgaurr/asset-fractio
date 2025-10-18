import { Injectable } from "@nestjs/common";
import { UserLoginHistoryRepository } from "../repositories/user-login-history.repository";
import { LoginClient, LoginType, UserMasterEntity } from "../entities";
import { createHash } from "crypto";
import { OnEvent } from "@nestjs/event-emitter";
import { constants } from "src/utils";

@Injectable()
export class UserLoginHistoryService {
    constructor(
        private readonly userLoginService: UserLoginHistoryRepository
    ) {}

    @OnEvent(constants.EVENT_NAMES.USER_SIGNUP)
    async saveSignupLogs({ user, header }: {user: UserMasterEntity, header}) {
        try {
            console.log('user signup event called.')
            await this.userLoginService.save({
                userId: user.id,
                clientType: header['x-client-type'] ?? LoginClient.WEB,
                type: LoginType.SIGNUP,
                ipAddress: header['x-ip-address'] ?? 'Testing Enviroment',
                latitude: header['x-latitude'] ?? 0,
                longitude: header['x-longitude'] ?? 0,
                browserInfo: header['x-browser'] ?? 'Postman',
                osInfo: header['x-operating-system'] ?? 'MacOS',
                deviceInfo: header['x-device-info'] ?? 'Apple Macbook Air', 
                deviceModel: header['x-device-model'] ?? 'Apple Macbook Air M2',
                deviceToken: createHash('sha256').update(header['x-ip-address'] ?? 'unknown').digest('hex')
            });
        } catch (error) {
            throw error; 
        }
    }

    @OnEvent(constants.EVENT_NAMES.USER_SIGNIN)
    async saveSigninLogs({ user, header }: {user: UserMasterEntity, header}) {
        try {
            await this.userLoginService.save({
                userId: user.id,
                clientType: header['x-client-type'] ?? LoginClient.WEB,
                type: LoginType.SIGNIN,
                ipAddress: header['x-ip-address'] ?? 'Testing Enviroment',
                latitude: header['x-latitude'] ?? 0,
                longitude: header['x-longitude'] ?? 0,
                browserInfo: header['x-browser'] ?? 'Postman',
                osInfo: header['x-operating-system'] ?? 'MacOS',
                deviceInfo: header['x-device-info'] ?? 'Apple Macbook Air', 
                deviceModel: header['x-device-model'] ?? 'Apple Macbook Air M2',
                deviceToken: createHash('sha256').update(header['x-ip-address'] ?? 'Testing Enviroment').digest('hex')
            });


        } catch (error) {
            throw error; 
        }
    }
}