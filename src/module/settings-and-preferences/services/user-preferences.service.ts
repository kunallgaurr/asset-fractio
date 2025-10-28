import { Injectable } from "@nestjs/common";
import { RedisService } from "src/connection/redis";
import { constants, HttpResponse } from "src/utils";
import { OnEvent } from "@nestjs/event-emitter";
import {
    UserPreferencesRepository,
    UserSettingsRepository
} from "../repositories";
import { UserMasterEntity } from "src/module/user";
import {
    InvestmentRisk,
    NotificationFrequency,
    PrivacyLevel,
    UserPreferencesEntity
} from "../entities";
import { TUpdatePreference } from "../settings-and-preferences.dto";

@Injectable()
export class PreferencesService {
    constructor(
        private readonly preferences: UserPreferencesRepository,
        private readonly redisService: RedisService
    ) { }

    private readonly defaultPreferences = {
        preferredAssetTypes: [],
        investmentRiskTolerance: InvestmentRisk.MEDIUM,
        minInvestmentAmount: 1000,
        maxInvestmentAmount: 100000,
        investmentGoals: 'Long-term wealth building',
        priceAlerts: true,
        priceAlertFrequency: NotificationFrequency.DAILY,
        auctionNotifications: true,
        bidNotifications: true,
        saleNotifications: true,
        newsletterSubscription: false,
        profilePrivacy: PrivacyLevel.PRIVATE,
        activityPrivacy: PrivacyLevel.PRIVATE,
        portfolioPrivacy: PrivacyLevel.PRIVATE,
        showOnlineStatus: true,
        allowDirectMessages: true,
        autoBidEnabled: false,
        maxAutoBidAmount: 5000,
        bidIncrementPreference: 10.00,
        snipingEnabled: false,
        snipingTimeSeconds: 10,
        defaultSortBy: 'created_at',
        defaultSortOrder: 'DESC',
        gridViewEnabled: true,
        compactMode: false,
        showAdvancedFilters: false,
        favoriteCategories: [],
        blockedUsers: [],
        watchlistNotifications: true,
        priceChangeThreshold: 5.00
    }

    @OnEvent(constants.EVENT_NAMES.PREFERENCES_CREATE)
    async createDefaultPreferences(user: UserMasterEntity) {
        try {
            const preferences = await this.preferences.findOne({
                where: { userId: user.id }
            });

            if (preferences) {
                return;
            }

            const defaultPreferences: Partial<UserPreferencesEntity> = {
                userId: user.id,
                ...this.defaultPreferences
            }

            await Promise.all([
                this.preferences.save(defaultPreferences),
                this.redisService.jSetAll(constants.REDIS_KEYS.USER_PREFERENCES + user.id, defaultPreferences, 60 * 60 * 24)
            ]);

            return;
        } catch (error) {
            throw error;
        }
    }

    async fetchPreferences(payload) {
        try {
            const { userId } = payload;

            const key = constants.REDIS_KEYS.USER_PREFERENCES + userId;
            let preferences: any = (await this.redisService.jGet(key, '$'))?.[0];

            if (!preferences || !Object.keys(preferences)) {
                preferences = await this.preferences.findOne({
                    where: { userId: userId }
                });

                this.redisService.jSetAll(key, preferences, 60 * 60 * 12);
            }

            if (!preferences) {
                const defaultPreferences: Partial<UserPreferencesEntity> = {
                    userId: userId,
                    ...this.defaultPreferences
                }

                this.preferences.save(defaultPreferences);
                return HttpResponse.success(defaultPreferences);
            }

            return HttpResponse.success(preferences);
        } catch (error) {
            return HttpResponse.internalServerError()
        }
    }


    async updatePreferences(payload: TUpdatePreference) {
        try {
            const key = constants.REDIS_KEYS.USER_PREFERENCES + payload.userId;
            const settings = await this.preferences.save(payload);
            this.redisService.jSetAll(key, settings, 60 * 60 * 12);

            return HttpResponse.success(settings);
        } catch (error) {
            console.log(error);
            return HttpResponse.internalServerError()
        }
    }
}