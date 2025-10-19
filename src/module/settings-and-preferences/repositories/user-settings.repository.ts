import { Injectable } from "@nestjs/common";
import { DeepPartial, FindManyOptions, FindOneOptions, FindOptionsWhere, InsertResult, Repository, SaveOptions } from "typeorm";
import { Currency, Language, Theme, Timezone, UserSettingsEntity } from "../entities";
import { InjectRepository } from "@nestjs/typeorm";
import { TIMEOUT } from "dns";

@Injectable()
export class UserSettingsRepository {
    constructor(
        @InjectRepository(UserSettingsEntity)
        private readonly repo: Repository<UserSettingsEntity>
    ) {}

    async find(options: FindManyOptions<UserSettingsEntity>): Promise<UserSettingsEntity[]> {
        return await this.repo.find(options);
    }

    async findOne(options: FindOneOptions<UserSettingsEntity>): Promise<UserSettingsEntity | null> {
        return await this.repo.findOne(options);
    }

    async save(entities: DeepPartial<UserSettingsEntity>): Promise<DeepPartial<UserSettingsEntity> & UserSettingsEntity> {
        return await this.repo.save(entities);
    }

    async insert(entity: DeepPartial<UserSettingsEntity>[]): Promise<InsertResult> {
        return await this.repo.insert(entity);
    }

    async update(criteria: FindOptionsWhere<UserSettingsEntity>, partialEntity: DeepPartial<UserSettingsEntity>) {
        return await this.repo.update(criteria, partialEntity);
    }

    async delete(criteria: FindOptionsWhere<UserSettingsEntity>) {
        return await this.repo.delete(criteria);
    }

    // Custom methods for user settings
    async findByUserId(userId: number): Promise<UserSettingsEntity | null> {
        return await this.repo.findOne({
            where: { userId }
        });
    }

    async createDefaultSettings(userId: number) {
        const defaultSettings: Partial<UserSettingsEntity> = {
            userId,
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
        };

         await this.repo.save(defaultSettings);
    }

    async updateSettings(userId: number, settings: DeepPartial<UserSettingsEntity>): Promise<UserSettingsEntity | null> {
        await this.repo.update({ userId }, settings);
        return await this.findByUserId(userId);
    }

    async updateNotificationSettings(userId: number, notificationSettings: {
        notificationsEnabled?: boolean;
        emailNotifications?: boolean;
        smsNotifications?: boolean;
        pushNotifications?: boolean;
        inAppNotifications?: boolean;
        marketingEmails?: boolean;
    }): Promise<UserSettingsEntity | null> {
        await this.repo.update({ userId }, notificationSettings);
        return await this.findByUserId(userId);
    }

    async updatePrivacySettings(userId: number, privacySettings: {
        profileVisibility?: string;
        dataSharing?: boolean;
        twoFactorEnabled?: boolean;
    }): Promise<UserSettingsEntity | null> {
        await this.repo.update({ userId }, privacySettings);
        return await this.findByUserId(userId);
    }

    async updateDisplaySettings(userId: number, displaySettings: {
        theme?: Theme;
        language?: Language;
        currency?: Currency;
        timezone?: Timezone;
        dateFormat?: string;
        timeFormat?: string;
        itemsPerPage?: number;
    }): Promise<UserSettingsEntity | null> {
        await this.repo.update({ userId }, displaySettings);
        return await this.findByUserId(userId);
    }
}
