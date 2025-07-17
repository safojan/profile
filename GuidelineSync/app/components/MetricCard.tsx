import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '../theme';
import { Card } from './Card';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  color?: string;
  style?: ViewStyle;
  compact?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit,
  subtitle,
  icon,
  color = theme.colors.accent,
  style,
  compact = false,
}) => {
  return (
    <Card style={[compact ? styles.compactContainer : styles.container, style]}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          {icon && (
            <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
              {icon}
            </View>
          )}
          <Text style={styles.title}>{title}</Text>
        </View>
      </View>
      
      <View style={styles.valueContainer}>
        <Text style={[styles.value, { color }]}>{value}</Text>
        {unit && <Text style={styles.unit}>{unit}</Text>}
      </View>
      
      {subtitle && (
        <Text style={styles.subtitle}>{subtitle}</Text>
      )}
    </Card>
  );
};

// Specialized metric cards
export const HeartRateCard: React.FC<{ bpm: number }> = ({ bpm }) => (
  <MetricCard
    title="Heart Rate"
    value={bpm}
    unit="bpm"
    color={theme.colors.cardiology}
    icon={<Text style={{ color: theme.colors.cardiology, fontSize: 16 }}>♥</Text>}
  />
);

export const GuidelineCountCard: React.FC<{ count: number; specialty?: string }> = ({ 
  count, 
  specialty 
}) => (
  <MetricCard
    title="Guidelines"
    value={count}
    subtitle={specialty ? `${specialty} specialty` : 'Total available'}
    color={theme.colors.info}
    icon={<Text style={{ color: theme.colors.info, fontSize: 16 }}>📋</Text>}
  />
);

export const TrustCard: React.FC<{ 
  trustName: string; 
  guidelineCount: number;
  color?: string;
}> = ({ trustName, guidelineCount, color = theme.colors.primary }) => (
  <MetricCard
    title={trustName}
    value={guidelineCount}
    unit="guidelines"
    color={color}
    compact
  />
);

const styles = StyleSheet.create({
  container: {
    minHeight: 120,
    flex: 1,
  },
  compactContainer: {
    minHeight: 80,
    flex: 1,
  },
  header: {
    marginBottom: theme.spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.textSecondary,
    flex: 1,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: theme.spacing.xs,
  },
  value: {
    fontSize: 28,
    fontWeight: '700',
    fontFamily: 'SpaceGrotesk-Bold',
  },
  unit: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.xs,
  },
  subtitle: {
    fontSize: 12,
    color: theme.colors.textTertiary,
    marginTop: theme.spacing.xs,
  },
});

