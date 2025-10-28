import { Currency, Language, Theme, Timezone, UserSettingsEntity } from "../entities";
import { RedisService } from "src/connection/redis";
import { constants, HttpResponse } from "src/utils";
import { OnEvent } from "@nestjs/event-emitter";
import { UserPreferencesRepository, UserSettingsRepository } from "../repositories";
import { UserMasterEntity } from "src/module/user";
import { TUpdateSettings } from "../settings-and-preferences.dto";
import { Injectable } from "@nestjs/common";
import { ca } from "zod/locales";

@Injectable()
export class SettingsService {
    constructor(
        private readonly settings: UserSettingsRepository,
        private readonly preferences: UserPreferencesRepository,
        private readonly redisService: RedisService
    ) { }

    private readonly defaultSettings = {
        theme: Theme.AUTO,
        language: Language.EN,
        currency: Currency.INR,
        timezone: Timezone.UTC,
        notificationsEnabled: true,
        emailNotifications: true,
        smsNotifications: false,
        pushNotifications: true,
        inAppNotifications: true,
        marketingEmails: false,
        twoFactorEnabled: false,
        dataSharing: true,
        profileVisibility: 'PRIVATE',
        autoSave: true,
        sessionTimeout: 30,
        itemsPerPage: 20,
        dateFormat: 'MM/DD/YYYY',
        timeFormat: '12H'
    }

    @OnEvent(constants.EVENT_NAMES.SETTINGS_CREATE)
    async createDefaultSettings(user: UserMasterEntity) {
        try {
            const settings = await this.settings.findOne({
                where: { userId: user.id }
            });

            if (settings) {
                return;
            }

            const defaultSettings: Partial<UserSettingsEntity> = {
                userId: user.id,
                ...this.defaultSettings
            }

            await Promise.all([
                this.settings.save(defaultSettings),
                this.redisService.jSetAll(constants.REDIS_KEYS.USER_SETTINGS + user.id, defaultSettings, 60 * 60 * 24)
            ]);

            return defaultSettings;
        } catch (error) {
            throw error;
        }
    }

    async fetchSettings(payload) {
        try {
            const { userId } = payload;

            const key = constants.REDIS_KEYS.USER_SETTINGS + userId;
            let settings: any = (await this.redisService.jGet(key, '$'))?.[0];

            if (!settings || !Object.keys(settings)) {
                settings = await this.settings.findOne({
                    where: { userId: userId }
                });

                this.redisService.jSetAll(key, settings, 60 * 60 * 12);
            }

            if (!settings) {
                const defaultSettings: Partial<UserSettingsEntity> = {
                    userId: userId,
                    ...this.defaultSettings
                }

                this.settings.save(defaultSettings);
                return HttpResponse.success(defaultSettings);
            }

            return HttpResponse.success(settings);
        } catch (error) {
            return HttpResponse.internalServerError()
        }
    }

    async updateSettings(payload: TUpdateSettings) {
        try {
            const key = constants.REDIS_KEYS.USER_SETTINGS + payload.userId;
            const settings = await this.settings.save(payload);
            this.redisService.jSetAll(key, settings, 60 * 60 * 12);

            return HttpResponse.success(settings);
        } catch (error) {
            return HttpResponse.internalServerError()
        }
    }
}