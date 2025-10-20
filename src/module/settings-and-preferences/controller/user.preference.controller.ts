import { Body, Controller, Get, Put, Query, UsePipes } from "@nestjs/common";
import { PreferencesService } from "../services";
import { type TUpdatePreference, updatePreferencesSchema } from "../settings-and-preferences.dto";
import { ZodValidationPipe } from "src/helpers";

@Controller('preferences')
export class PreferencesController {
    constructor(
        private readonly preferences: PreferencesService
    ) { }

    @Get('fetch')
    async getSettings(@Query() query) {
        return await this.preferences.fetchPreferences(query);
    }

    @Put('update')
    @UsePipes(new ZodValidationPipe(updatePreferencesSchema))
    async updatePrefernces(@Body() body: TUpdatePreference) {
        return await this.preferences.updatePreferences(body);
    }
};