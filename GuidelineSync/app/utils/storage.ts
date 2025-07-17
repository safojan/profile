import AsyncStorage from '@react-native-async-storage/async-storage';
import { Config } from '../config/env';
import { User } from '../types';

// Storage keys
const STORAGE_KEYS = {
  JWT_TOKEN: Config.JWT_STORAGE_KEY,
  USER_DATA: 'user_data',
  OFFLINE_GUIDELINES: 'offline_guidelines',
  APP_SETTINGS: 'app_settings',
} as const;

// Token management
export const storeToken = async (token: string): Promise<void> => {
  await AsyncStorage.setItem(STORAGE_KEYS.JWT_TOKEN, token);
};

export const getStoredToken = async (): Promise<string | null> => {
  return await AsyncStorage.getItem(STORAGE_KEYS.JWT_TOKEN);
};

export const removeStoredToken = async (): Promise<void> => {
  await AsyncStorage.removeItem(STORAGE_KEYS.JWT_TOKEN);
};

// User data management
export const storeUserData = async (user: User): Promise<void> => {
  await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
};

export const getStoredUserData = async (): Promise<User | null> => {
  const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
  return userData ? JSON.parse(userData) : null;
};

export const removeStoredUserData = async (): Promise<void> => {
  await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
};

// Offline guidelines management
export const storeOfflineGuidelines = async (guidelines: any[]): Promise<void> => {
  await AsyncStorage.setItem(STORAGE_KEYS.OFFLINE_GUIDELINES, JSON.stringify(guidelines));
};

export const getStoredOfflineGuidelines = async (): Promise<any[]> => {
  const guidelines = await AsyncStorage.getItem(STORAGE_KEYS.OFFLINE_GUIDELINES);
  return guidelines ? JSON.parse(guidelines) : [];
};

export const removeStoredOfflineGuidelines = async (): Promise<void> => {
  await AsyncStorage.removeItem(STORAGE_KEYS.OFFLINE_GUIDELINES);
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

export const storeAppSettings = async (settings: Partial<AppSettings>): Promise<void> => {
  const currentSettings = await getStoredAppSettings();
  const updatedSettings = { ...currentSettings, ...settings };
  await AsyncStorage.setItem(STORAGE_KEYS.APP_SETTINGS, JSON.stringify(updatedSettings));
};

export const getStoredAppSettings = async (): Promise<AppSettings> => {
  const settings = await AsyncStorage.getItem(STORAGE_KEYS.APP_SETTINGS);
  return settings ? { ...defaultSettings, ...JSON.parse(settings) } : defaultSettings;
};

// Clear all stored data (for logout)
export const clearAllStoredData = async (): Promise<void> => {
  await removeStoredToken();
  await removeStoredUserData();
  await removeStoredOfflineGuidelines();
  // Keep app settings
};

// Check if user is authenticated
export const isAuthenticated = async (): Promise<boolean> => {
  const token = await getStoredToken();
  const userData = await getStoredUserData();
  return !!(token && userData);
};
