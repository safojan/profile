import { MMKV } from 'react-native-mmkv';
import { Config } from '../config/env';
import { User } from '../types';

// Initialize MMKV storage
const storage = new MMKV();

// Storage keys
const STORAGE_KEYS = {
  JWT_TOKEN: Config.JWT_STORAGE_KEY,
  USER_DATA: 'user_data',
  OFFLINE_GUIDELINES: 'offline_guidelines',
  APP_SETTINGS: 'app_settings',
} as const;

// Token management
export const storeToken = (token: string): void => {
  storage.set(STORAGE_KEYS.JWT_TOKEN, token);
};

export const getStoredToken = (): string | undefined => {
  return storage.getString(STORAGE_KEYS.JWT_TOKEN);
};

export const removeStoredToken = (): void => {
  storage.delete(STORAGE_KEYS.JWT_TOKEN);
};

// User data management
export const storeUserData = (user: User): void => {
  storage.set(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
};

export const getStoredUserData = (): User | null => {
  const userData = storage.getString(STORAGE_KEYS.USER_DATA);
  return userData ? JSON.parse(userData) : null;
};

export const removeStoredUserData = (): void => {
  storage.delete(STORAGE_KEYS.USER_DATA);
};

// Offline guidelines management
export const storeOfflineGuidelines = (guidelines: any[]): void => {
  storage.set(STORAGE_KEYS.OFFLINE_GUIDELINES, JSON.stringify(guidelines));
};

export const getStoredOfflineGuidelines = (): any[] => {
  const guidelines = storage.getString(STORAGE_KEYS.OFFLINE_GUIDELINES);
  return guidelines ? JSON.parse(guidelines) : [];
};

export const removeStoredOfflineGuidelines = (): void => {
  storage.delete(STORAGE_KEYS.OFFLINE_GUIDELINES);
};

// App settings management
interface AppSettings {
  theme: 'light' | 'dark';
  language: string;
  offlineMode: boolean;
  notifications: boolean;
}

const defaultSettings: AppSettings = {
  theme: 'light',
  language: 'en',
  offlineMode: Config.ENABLE_OFFLINE_MODE,
  notifications: true,
};

export const storeAppSettings = (settings: Partial<AppSettings>): void => {
  const currentSettings = getStoredAppSettings();
  const updatedSettings = { ...currentSettings, ...settings };
  storage.set(STORAGE_KEYS.APP_SETTINGS, JSON.stringify(updatedSettings));
};

export const getStoredAppSettings = (): AppSettings => {
  const settings = storage.getString(STORAGE_KEYS.APP_SETTINGS);
  return settings ? { ...defaultSettings, ...JSON.parse(settings) } : defaultSettings;
};

// Clear all stored data (for logout)
export const clearAllStoredData = (): void => {
  removeStoredToken();
  removeStoredUserData();
  removeStoredOfflineGuidelines();
  // Keep app settings
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const token = getStoredToken();
  const userData = getStoredUserData();
  return !!(token && userData);
};

