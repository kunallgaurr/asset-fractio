import { Body, Controller, Get, ParseIntPipe, Put, Query, UsePipes } from "@nestjs/common";
import { SettingsService } from "../services";
import { User, ZodValidationPipe } from "src/helpers";
import { type TUpdateSettings, updateSettingsSchema } from "../settings-and-preferences.dto";

@Controller('settings')
export class SettingsController {
    constructor(
        private readonly settings: SettingsService
    ) { }

    @Get('fetch')
    async getSettings(@User('id') id: ParseIntPipe) {
        return await this.settings.fetchSettings({ userId: id });
    }

    @Put('update')
    @UsePipes(new ZodValidationPipe(updateSettingsSchema))
    async updateSettings(@Body() body: TUpdateSettings) {
        return await this.settings.updateSettings(body);
    }
}