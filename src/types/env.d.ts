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
  }

  export const Config: NativeConfig;
  export default Config;
}
