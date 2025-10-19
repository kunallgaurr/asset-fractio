import { Controller, Get, Query } from "@nestjs/common";
import { UserLoginHistoryService } from "../services";

@Controller('user-login-history')
export class UserLoginHistoryController {
    constructor(
        private readonly userLoginHistory: UserLoginHistoryService
    ) { }

    @Get('fetch-history')
    async fetchHistory(@Query() query) {
        return await this.userLoginHistory.getLogs(query);

    }
}