export const colors = {
  // Primary colors for healthcare app
  primary: '#007AFF', // Professional blue for trust
  primaryDark: '#0056CC',
  primaryLight: '#4DA3FF',
  
  // Secondary colors
  secondary: '#34C759', // Green for health/success
  secondaryDark: '#28A745',
  secondaryLight: '#5ED670',
  
  // Background colors
  background: '#F5F5F5', // Light gray for clean UI
  backgroundDark: '#FFFFFF',
  surface: '#FFFFFF',
  
  // Text colors
  text: '#333333', // Dark text for readability
  textSecondary: '#666666',
  textLight: '#999999',
  textInverse: '#FFFFFF',
  
  // Status colors
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  info: '#007AFF',
  
  // Border and divider colors
  border: '#E5E5E5',
  divider: '#F0F0F0',
  
  // Specialty colors for medical specialties
  cardiology: '#FF6B6B',
  respiratory: '#4ECDC4',
  neurology: '#45B7D1',
  oncology: '#96CEB4',
  pediatrics: '#FFEAA7',
  emergency: '#FF7675',
  
  // Transparent overlays
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.2)',
} as const;

export type ColorName = keyof typeof colors;

