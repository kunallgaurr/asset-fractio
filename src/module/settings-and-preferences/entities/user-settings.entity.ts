import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum NotificationType {
    EMAIL = 'EMAIL',
    SMS = 'SMS',
    PUSH = 'PUSH',
    IN_APP = 'IN_APP'
}

export enum Theme {
    LIGHT = 'LIGHT',
    DARK = 'DARK',
    AUTO = 'AUTO'
}

export enum Language {
    EN = 'EN',
    ES = 'ES',
    FR = 'FR',
    DE = 'DE',
    IT = 'IT',
    PT = 'PT',
    RU = 'RU',
    ZH = 'ZH',
    JA = 'JA',
    KO = 'KO'
}

export enum Currency {
    USD = 'USD',
    EUR = 'EUR',
    GBP = 'GBP',
    JPY = 'JPY',
    CAD = 'CAD',
    AUD = 'AUD',
    CHF = 'CHF',
    CNY = 'CNY',
    INR = 'INR',
    BRL = 'BRL'
}

export enum Timezone {
    UTC = 'UTC',
    EST = 'EST',
    PST = 'PST',
    GMT = 'GMT',
    CET = 'CET',
    JST = 'JST',
    IST = 'IST',
    AEST = 'AEST'
}

@Entity('user_settings')
export class UserSettingsEntity {
    @PrimaryGeneratedColumn({
        name: 'id',
        type: 'int',
        unsigned: true
    })
    id: number;

    @Column({
        name: 'user_id',
        type: 'int',
        unsigned: true,
        unique: true
    })
    userId: number;

    @Column({
        name: 'theme',
        type: 'enum',
        enum: Theme,
        default: Theme.AUTO
    })
    theme: Theme;

    @Column({
        name: 'language',
        type: 'enum',
        enum: Language,
        default: Language.EN
    })
    language: Language;

    @Column({
        name: 'currency',
        type: 'enum',
        enum: Currency,
        default: Currency.USD
    })
    currency: Currency;

    @Column({
        name: 'timezone',
        type: 'enum',
        enum: Timezone,
        default: Timezone.UTC
    })
    timezone: Timezone;

    @Column({
        name: 'notifications_enabled',
        type: 'boolean',
        default: true
    })
    notificationsEnabled: boolean;

    @Column({
        name: 'email_notifications',
        type: 'boolean',
        default: true
    })
    emailNotifications: boolean;

    @Column({
        name: 'sms_notifications',
        type: 'boolean',
        default: false
    })
    smsNotifications: boolean;

    @Column({
        name: 'push_notifications',
        type: 'boolean',
        default: true
    })
    pushNotifications: boolean;

    @Column({
        name: 'in_app_notifications',
        type: 'boolean',
        default: true
    })
    inAppNotifications: boolean;

    @Column({
        name: 'marketing_emails',
        type: 'boolean',
        default: false
    })
    marketingEmails: boolean;

    @Column({
        name: 'two_factor_enabled',
        type: 'boolean',
        default: false
    })
    twoFactorEnabled: boolean;

    @Column({
        name: 'data_sharing',
        type: 'boolean',
        default: true
    })
    dataSharing: boolean;

    @Column({
        name: 'profile_visibility',
        type: 'enum',
        enum: ['PUBLIC', 'PRIVATE', 'FRIENDS_ONLY'],
        default: 'PRIVATE'
    })
    profileVisibility: string;

    @Column({
        name: 'auto_save',
        type: 'boolean',
        default: true
    })
    autoSave: boolean;

    @Column({
        name: 'session_timeout',
        type: 'int',
        default: 30 // minutes
    })
    sessionTimeout: number;

    @Column({
        name: 'items_per_page',
        type: 'int',
        default: 20
    })
    itemsPerPage: number;

    @Column({
        name: 'date_format',
        type: 'varchar',
        length: 20,
        default: 'MM/DD/YYYY'
    })
    dateFormat: string;

    @Column({
        name: 'time_format',
        type: 'enum',
        enum: ['12H', '24H'],
        default: '12H'
    })
    timeFormat: string;

    @CreateDateColumn({
        name: 'created_at',
        default: new Date()
    })
    createdAt: Date;

    @UpdateDateColumn({
        name: 'updated_at',
        default: new Date()
    })
    updatedAt: Date;
}
