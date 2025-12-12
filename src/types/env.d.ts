declare module 'react-native-config' {
  export interface NativeConfig {
    API_BASE_URL: string;
    API_KEY?: string;
    AUTH_DOMAIN?: string;
    PROJECT_ID?: string;
    STORAGE_BUCKET?: string;
    MESSAGING_SENDER_ID?: string;
    APP_ID?: string;
    MEASUREMENT_ID?: string;
    WEEKLY_PRICE?: string;
    WEEKLY_PRICE_ID?: string;
    MONTHLY_PRICE?: string;
    MONTHLY_PRICE_ID?: string;
    YEARLY_PRICE?: string;
    YEARLY_PRICE_ID?: string;
    USER_WEBSITE_URL?: string;
    STRIPE_PUBLISHABLE_KEY?: string;
    USE_COMPANY_LOGO?: string;
  }

  export const Config: NativeConfig;
  export default Config;
}
