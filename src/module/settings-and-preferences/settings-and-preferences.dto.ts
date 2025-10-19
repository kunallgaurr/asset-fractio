import { z } from 'zod';
import { AssetType, Currency, InvestmentRisk, Language, NotificationFrequency, NotificationType, PrivacyLevel, Theme, Timezone } from './entities';

// Enums from your TypeScript code
export const NotificationTypeEnum = z.enum(NotificationType);
export const ThemeEnum = z.enum(Theme);
export const LanguageEnum = z.enum(Language);
export const CurrencyEnum = z.enum(Currency);
export const TimezoneEnum = z.enum(Timezone);
export const ProfileVisibilityEnum = z.enum(['PUBLIC', 'PRIVATE']);
export const TimeFormatEnum = z.enum(['12H', '24H']);

// Zod schema for the settings payload
export const updateSettingsSchema = z.object({
  userId: z.number().int().positive().optional(),

  theme: ThemeEnum.optional(),
  language: LanguageEnum.optional(),
  currency: CurrencyEnum.optional(),
  timezone: TimezoneEnum.optional(),

  notificationsEnabled: z.boolean().optional(),
  emailNotifications: z.boolean().optional(),
  smsNotifications: z.boolean().optional(),
  pushNotifications: z.boolean().optional(),
  inAppNotifications: z.boolean().optional(),

  marketingEmails: z.boolean().optional(),
  twoFactorEnabled: z.boolean().optional(),
  dataSharing: z.boolean().optional(),

  profileVisibility: ProfileVisibilityEnum.optional(),

  autoSave: z.boolean().optional(),
  sessionTimeout: z.number().int().min(1).max(1440).optional(), // 1 min to 24 hrs
  itemsPerPage: z.number().int().min(1).max(100).optional(),

  dateFormat: z.string().max(20).optional(),
  timeFormat: TimeFormatEnum.optional(),
});

export type TUpdateSettings = z.infer<typeof updateSettingsSchema>;

// Enums from your Entity
export const AssetTypeEnum = z.enum(AssetType);
export const InvestmentRiskEnum = z.enum(InvestmentRisk);
export const NotificationFrequencyEnum = z.enum(NotificationFrequency);
export const PrivacyLevelEnum = z.enum(PrivacyLevel);
export const SortOrderEnum = z.enum(['ASC', 'DESC']);

// Main Zod Schema
export const updatePreferencesSchema = z.object({
  userId: z.number().int().positive().optional(),

  // Investment Preferences
  preferredAssetTypes: z.array(AssetTypeEnum).optional(),
  investmentRiskTolerance: InvestmentRiskEnum.optional(),
  minInvestmentAmount: z.number().min(0).optional(),
  maxInvestmentAmount: z.number().min(0).optional(),
  investmentGoals: z.string().max(1000).optional(),

  // Notification Preferences
  priceAlerts: z.boolean().optional(),
  priceAlertFrequency: NotificationFrequencyEnum.optional(),
  auctionNotifications: z.boolean().optional(),
  bidNotifications: z.boolean().optional(),
  saleNotifications: z.boolean().optional(),
  newsletterSubscription: z.boolean().optional(),

  // Privacy Preferences
  profilePrivacy: PrivacyLevelEnum.optional(),
  activityPrivacy: PrivacyLevelEnum.optional(),
  portfolioPrivacy: PrivacyLevelEnum.optional(),
  showOnlineStatus: z.boolean().optional(),
  allowDirectMessages: z.boolean().optional(),

  // Trading Preferences
  autoBidEnabled: z.boolean().optional(),
  maxAutoBidAmount: z.number().min(0).optional(),
  bidIncrementPreference: z.number().min(0).optional(),
  snipingEnabled: z.boolean().optional(),
  snipingTimeSeconds: z.number().int().min(0).optional(),

  // Display Preferences
  defaultSortBy: z.string().max(50).optional(),
  defaultSortOrder: SortOrderEnum.optional(),
  gridViewEnabled: z.boolean().optional(),
  compactMode: z.boolean().optional(),
  showAdvancedFilters: z.boolean().optional(),

  // Additional Preferences
  favoriteCategories: z.array(z.string()).optional(),
  blockedUsers: z.array(z.number().int()).optional(),
  watchlistNotifications: z.boolean().optional(),
  priceChangeThreshold: z.number().min(0).max(100).optional(), // assuming it's a percentage
});

export type TUpdatePreference = z.infer<typeof updatePreferencesSchema>

