import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { theme } from '../theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: keyof typeof theme.spacing;
  margin?: keyof typeof theme.spacing;
  shadow?: boolean;
  backgroundColor?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  padding = 'cardPadding',
  margin = 'cardMargin',
  shadow = true,
  backgroundColor = theme.colors.backgroundCard,
}) => {
  const cardStyle: ViewStyle = {
    backgroundColor,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing[padding],
    margin: theme.spacing[margin],
    ...(shadow && theme.shadows.card),
  };

  return (
    <View style={[cardStyle, style]}>
      {children}
    </View>
  );
};

// Specialized card variants
export const StatCard: React.FC<CardProps & { 
  accent?: boolean;
  accentColor?: string;
}> = ({ 
  children, 
  style, 
  accent = false, 
  accentColor = theme.colors.accent,
  ...props 
}) => {
  const accentStyle: ViewStyle = accent ? {
    borderLeftWidth: 4,
    borderLeftColor: accentColor,
  } : {};

  return (
    <Card style={[accentStyle, style]} {...props}>
      {children}
    </Card>
  );
};

export const CompactCard: React.FC<CardProps> = ({ children, style, ...props }) => {
  return (
    <Card 
      padding="md" 
      margin="sm" 
      style={[styles.compactCard, style]} 
      {...props}
    >
      {children}
    </Card>
  );
};

export const FullWidthCard: React.FC<CardProps> = ({ children, style, ...props }) => {
  return (
    <Card 
      margin="sm" 
      style={[styles.fullWidthCard, style]} 
      {...props}
    >
      {children}
    </Card>
  );
};

const styles = StyleSheet.create({
  compactCard: {
    minHeight: 60,
  },
  fullWidthCard: {
    marginHorizontal: theme.spacing.screenMargin,
  },
});

