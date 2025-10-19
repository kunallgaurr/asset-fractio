import { Controller, Get, Query } from "@nestjs/common";
import { SettingsService } from "../services";

@Controller('settings') 
export class SettingsController {
    constructor(
        private readonly settings: SettingsService
    ) {}

    @Get('fetch')
    async getSettings(@Query() query) {
        console.log(query);
        return await this.settings.fetchSettings(query);
    }
}