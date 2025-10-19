import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum AssetType {
    IFO_PENDING = 'IFO PENDING',
    IFO_APPROVED = 'IFO APPROVED'
}

export enum InvestmentRisk {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
    VERY_HIGH = 'VERY_HIGH'
}

export enum NotificationFrequency {
    IMMEDIATE = 'IMMEDIATE',
    DAILY = 'DAILY',
    WEEKLY = 'WEEKLY',
    MONTHLY = 'MONTHLY',
    NEVER = 'NEVER'
}

export enum PrivacyLevel {
    PUBLIC = 'PUBLIC',
    PRIVATE = 'PRIVATE'
}

@Entity('user_preferences')
export class UserPreferencesEntity {
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

    // Investment Preferences
    @Column({
        name: 'preferred_asset_types',
        type: 'json',
        nullable: true
    })
    preferredAssetTypes: AssetType[];

    @Column({
        name: 'investment_risk_tolerance',
        type: 'enum',
        enum: InvestmentRisk,
        default: InvestmentRisk.MEDIUM
    })
    investmentRiskTolerance: InvestmentRisk;

    @Column({
        name: 'min_investment_amount',
        type: 'decimal',
        precision: 15,
        scale: 2,
        nullable: true
    })
    minInvestmentAmount: number;

    @Column({
        name: 'max_investment_amount',
        type: 'decimal',
        precision: 15,
        scale: 2,
        nullable: true
    })
    maxInvestmentAmount: number;

    @Column({
        name: 'investment_goals',
        type: 'text',
        nullable: true
    })
    investmentGoals: string;

    // Notification Preferences
    @Column({
        name: 'price_alerts',
        type: 'boolean',
        default: true
    })
    priceAlerts: boolean;

    @Column({
        name: 'price_alert_frequency',
        type: 'enum',
        enum: NotificationFrequency,
        default: NotificationFrequency.DAILY
    })
    priceAlertFrequency: NotificationFrequency;

    @Column({
        name: 'auction_notifications',
        type: 'boolean',
        default: true
    })
    auctionNotifications: boolean;

    @Column({
        name: 'bid_notifications',
        type: 'boolean',
        default: true
    })
    bidNotifications: boolean;

    @Column({
        name: 'sale_notifications',
        type: 'boolean',
        default: true
    })
    saleNotifications: boolean;

    @Column({
        name: 'newsletter_subscription',
        type: 'boolean',
        default: false
    })
    newsletterSubscription: boolean;

    // Privacy Preferences
    @Column({
        name: 'profile_privacy',
        type: 'enum',
        enum: PrivacyLevel,
        default: PrivacyLevel.PRIVATE
    })
    profilePrivacy: PrivacyLevel;

    @Column({
        name: 'activity_privacy',
        type: 'enum',
        enum: PrivacyLevel,
        default: PrivacyLevel.PRIVATE
    })
    activityPrivacy: PrivacyLevel;

    @Column({
        name: 'portfolio_privacy',
        type: 'enum',
        enum: PrivacyLevel,
        default: PrivacyLevel.PRIVATE
    })
    portfolioPrivacy: PrivacyLevel;

    @Column({
        name: 'show_online_status',
        type: 'boolean',
        default: true
    })
    showOnlineStatus: boolean;

    @Column({
        name: 'allow_direct_messages',
        type: 'boolean',
        default: true
    })
    allowDirectMessages: boolean;

    // Trading Preferences
    @Column({
        name: 'auto_bid_enabled',
        type: 'boolean',
        default: false
    })
    autoBidEnabled: boolean;

    @Column({
        name: 'max_auto_bid_amount',
        type: 'decimal',
        precision: 15,
        scale: 2,
        nullable: true
    })
    maxAutoBidAmount: number;

    @Column({
        name: 'bid_increment_preference',
        type: 'decimal',
        precision: 10,
        scale: 2,
        default: 10.00
    })
    bidIncrementPreference: number;

    @Column({
        name: 'sniping_enabled',
        type: 'boolean',
        default: false
    })
    snipingEnabled: boolean;

    @Column({
        name: 'sniping_time_seconds',
        type: 'int',
        default: 10
    })
    snipingTimeSeconds: number;

    // Display Preferences
    @Column({
        name: 'default_sort_by',
        type: 'varchar',
        length: 50,
        default: 'created_at'
    })
    defaultSortBy: string;

    @Column({
        name: 'default_sort_order',
        type: 'enum',
        enum: ['ASC', 'DESC'],
        default: 'DESC'
    })
    defaultSortOrder: string;

    @Column({
        name: 'grid_view_enabled',
        type: 'boolean',
        default: true
    })
    gridViewEnabled: boolean;

    @Column({
        name: 'compact_mode',
        type: 'boolean',
        default: false
    })
    compactMode: boolean;

    @Column({
        name: 'show_advanced_filters',
        type: 'boolean',
        default: false
    })
    showAdvancedFilters: boolean;

    // Additional Preferences
    @Column({
        name: 'favorite_categories',
        type: 'json',
        nullable: true
    })
    favoriteCategories: string[];

    @Column({
        name: 'blocked_users',
        type: 'json',
        nullable: true
    })
    blockedUsers: number[];

    @Column({
        name: 'watchlist_notifications',
        type: 'boolean',
        default: true
    })
    watchlistNotifications: boolean;

    @Column({
        name: 'price_change_threshold',
        type: 'decimal',
        precision: 5,
        scale: 2,
        default: 5.00 // percentage
    })
    priceChangeThreshold: number;

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
