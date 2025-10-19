import { Controller, Get, Query } from "@nestjs/common";
import { PreferencesService } from "../services";

@Controller('preferences')
export class PreferencesController {
    constructor(
        private readonly preferences: PreferencesService
    ) { }

    @Get('fetch')
    async getSettings(@Query() query) {
        return await this.preferences.fetchPreferences(query);
    }
};