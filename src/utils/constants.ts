const PROVIDERS = {
    REDIS_CONNECTION: 'REDIS_CONNECTION'
}

const REDIS_KEYS = {
    USERNAME_SET: 'af:username:set',
    EMAIL_SET: 'af:email:set',
    USER_DATA: 'af:user:', // user id
    USER_SETTINGS: 'af:user-settings:', // user Id
    USER_PREFERENCES: 'af:user-preferences:' // user id
}

const EVENT_NAMES = {
    USER_SIGNUP: 'user.signup',
    USER_SIGNIN: 'user.signin',
    USER_WELCOME: 'user.welcome',

    OTP_REQUEST: 'otp.request',
    OTP_VERIFY: 'otp.verify',
    OTP_RESEND: 'otp.resend',
    OTP_EXPIRE: 'otp.expire',
    OTP_INVALID: 'otp.invalid',
    OTP_EXPIRED: 'otp.expired',
    
    SETTINGS_CREATE: 'settings.create',
    PREFERENCES_CREATE: 'preferences.create',

    USER_UPDATED: 'user.updated',
    USER_EMAIL_UPDATED: 'user.email_updated',
    USER_USERNAME_UPDATED: 'user.username_updated',
    USER_PHONE_NUMBER_UPDATED: 'user.phone_number_updated'
}

export const constants = {
    SYNC_DB: true,
    GLOBAL_LIMIT_THRESHOLD: 20,
    PROVIDERS,
    REDIS_KEYS,
    EVENT_NAMES  
}