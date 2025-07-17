export const Config = {
  // API Configuration
  API_URL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api',
  
  // AWS Configuration
  AWS_REGION: process.env.EXPO_PUBLIC_AWS_REGION || 'eu-west-2',
  AWS_S3_BUCKET: process.env.EXPO_PUBLIC_AWS_S3_BUCKET || 'guidelinesync-guidelines',
  
  // App Configuration
  APP_NAME: 'GuidelineSync',
  APP_VERSION: '1.0.0',
  
  // Feature Flags
  ENABLE_AI_CHAT: process.env.EXPO_PUBLIC_ENABLE_AI_CHAT === 'true',
  ENABLE_OFFLINE_MODE: process.env.EXPO_PUBLIC_ENABLE_OFFLINE_MODE !== 'false',
  
  // Development
  IS_DEV: __DEV__,
  
  // Security
  JWT_STORAGE_KEY: 'guidelinesync_jwt_token',
  
  // Pagination
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;

