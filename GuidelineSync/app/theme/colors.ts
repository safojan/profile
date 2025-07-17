export const colors = {
  // Primary colors - matching the medical app design
  primary: '#2C3E50', // Dark blue-gray for professional look
  primaryDark: '#1A252F',
  primaryLight: '#34495E',
  
  // Accent colors - red accent like in the image
  accent: '#E74C3C', // Red accent for highlights
  accentDark: '#C0392B',
  accentLight: '#EC7063',
  
  // Background colors - light, clean backgrounds
  background: '#F8F9FA', // Very light gray background
  backgroundCard: '#FFFFFF', // White card backgrounds
  surface: '#FFFFFF',
  surfaceVariant: '#F1F3F4',
  
  // Text colors - clean hierarchy
  text: '#2C3E50', // Dark blue-gray for primary text
  textSecondary: '#7F8C8D', // Medium gray for secondary text
  textTertiary: '#BDC3C7', // Light gray for tertiary text
  textLight: '#FFFFFF', // White text for dark backgrounds
  textMuted: '#95A5A6', // Muted text for placeholders
  
  // Status colors
  success: '#27AE60', // Green for success states
  warning: '#F39C12', // Orange for warnings
  error: '#E74C3C', // Red for errors
  info: '#3498DB', // Blue for info
  
  // Border and divider colors
  border: '#ECF0F1', // Very light border
  divider: '#E8EAED', // Light divider
  borderLight: '#F8F9FA',
  
  // Medical specialty colors - soft, professional palette
  cardiology: '#E74C3C', // Red for cardiology
  neurology: '#9B59B6', // Purple for neurology
  pediatrics: '#3498DB', // Blue for pediatrics
  oncology: '#E67E22', // Orange for oncology
  emergency: '#F1C40F', // Yellow for emergency
  surgery: '#1ABC9C', // Teal for surgery
  respiratory: '#16A085', // Dark teal for respiratory
  psychiatry: '#8E44AD', // Dark purple for psychiatry
  dermatology: '#E91E63', // Pink for dermatology
  orthopedics: '#795548', // Brown for orthopedics
  radiology: '#607D8B', // Blue-gray for radiology
  pathology: '#FF5722', // Deep orange for pathology
  anesthesiology: '#9E9E9E', // Gray for anesthesiology
  generalMedicine: '#4CAF50', // Green for general medicine
  
  // Trust colors for different hospitals
  stGeorges: '#E74C3C',
  royalLondon: '#3498DB',
  manchester: '#27AE60',
  birmingham: '#F39C12',
  
  // Chart and data visualization colors
  chartPrimary: '#E74C3C',
  chartSecondary: '#3498DB',
  chartTertiary: '#27AE60',
  chartBackground: '#F8F9FA',
  
  // Interactive states
  pressed: '#E8EAED', // Light gray for pressed state
  disabled: '#BDC3C7', // Gray for disabled state
  selected: '#EBF3FD', // Light blue for selected state
  
  // Shadow colors
  shadow: 'rgba(44, 62, 80, 0.1)', // Subtle shadow
  shadowDark: 'rgba(44, 62, 80, 0.2)', // Darker shadow
  shadowLight: 'rgba(44, 62, 80, 0.05)', // Very light shadow
  
  // Overlay colors
  overlay: 'rgba(44, 62, 80, 0.6)', // Dark overlay
  overlayLight: 'rgba(44, 62, 80, 0.3)', // Light overlay
  
  // Utility colors
  white: '#FFFFFF',
  black: '#2C3E50',
  transparent: 'transparent',
} as const;

export type ColorName = keyof typeof colors;
