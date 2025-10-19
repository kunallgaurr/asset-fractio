import { Injectable } from "@nestjs/common";
import { UserUpdateLogsRepository } from "../repositories";
import { OnEvent } from "@nestjs/event-emitter";
import { constants } from "src/utils";

@Injectable()
export class UserUpdateLogsService {
    constructor(
        private readonly userUpdateLogs: UserUpdateLogsRepository
    ) {}

    @OnEvent(constants.EVENT_NAMES.USER_UPDATED)
    async pushUpdateLog(payload) {
        try {
            const {userId, key, value} = payload

            await this.userUpdateLogs.save({
                userId,
                key,
                value
            });

            return;
        } catch (error) {
            throw error;
        }
    }
}