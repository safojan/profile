export const spacing = {
  // Base spacing units - tighter for modern card design
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  
  // Card spacing - matching the medical app layout
  cardPadding: 16,
  cardMargin: 12,
  cardGap: 16,
  
  // Screen spacing
  screenPadding: 20,
  screenMargin: 16,
  
  // Component spacing
  buttonPadding: 12,
  inputPadding: 14,
  listItemPadding: 16,
  iconSpacing: 8,
  
  // Layout spacing
  sectionSpacing: 24,
  itemSpacing: 8,
  groupSpacing: 16,
  headerSpacing: 20,
} as const;

export const borderRadius = {
  sm: 6,
  md: 8,
  lg: 12, // Card radius matching the medical app
  xl: 16,
  xxl: 20,
  full: 9999,
} as const;

export const shadows = {
  // Subtle shadows for card-based design
  card: {
    shadowColor: '#2C3E50',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  sm: {
    shadowColor: '#2C3E50',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  md: {
    shadowColor: '#2C3E50',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#2C3E50',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  button: {
    shadowColor: '#2C3E50',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
} as const;
