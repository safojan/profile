import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { theme } from '../theme';
import { Guideline, MedicalSpeciality } from '../types';

interface GuidelineCardProps {
  guideline: Guideline;
  onPress: (guideline: Guideline) => void;
}

const getSpecialityColor = (speciality: MedicalSpeciality): string => {
  const specialityColors = {
    cardiology: theme.colors.cardiology,
    respiratory: theme.colors.respiratory,
    neurology: theme.colors.neurology,
    oncology: theme.colors.oncology,
    pediatrics: theme.colors.pediatrics,
    emergency: theme.colors.emergency,
    surgery: theme.colors.primary,
    psychiatry: theme.colors.secondary,
    dermatology: theme.colors.warning,
    orthopedics: theme.colors.info,
    radiology: theme.colors.primary,
    pathology: theme.colors.secondary,
    anesthesiology: theme.colors.warning,
    general_medicine: theme.colors.primary,
    other: theme.colors.textSecondary,
  };
  
  return specialityColors[speciality] || theme.colors.primary;
};

const formatSpecialityName = (speciality: MedicalSpeciality): string => {
  return speciality.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
};

export const GuidelineCard: React.FC<GuidelineCardProps> = ({
  guideline,
  onPress,
}) => {
  const specialityColor = getSpecialityColor(guideline.medicalSpeciality);
  
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(guideline)}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={2}>
            {guideline.title}
          </Text>
          <Text style={styles.trustName}>{guideline.trustName}</Text>
        </View>
        
        <View style={[styles.specialityBadge, { backgroundColor: specialityColor }]}>
          <Text style={styles.specialityText}>
            {formatSpecialityName(guideline.medicalSpeciality)}
          </Text>
        </View>
      </View>
      
      {guideline.description && (
        <Text style={styles.description} numberOfLines={3}>
          {guideline.description}
        </Text>
      )}
      
      <View style={styles.footer}>
        <View style={styles.typeIndicator}>
          <Text style={styles.typeText}>
            {guideline.fileType === 'pdf' ? '📄 PDF' : '📝 Text'}
          </Text>
        </View>
        
        {guideline.tags && guideline.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {guideline.tags.slice(0, 2).map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
            {guideline.tags.length > 2 && (
              <Text style={styles.moreTagsText}>+{guideline.tags.length - 2}</Text>
            )}
          </View>
        )}
      </View>
      
      <Text style={styles.updatedAt}>
        Updated {new Date(guideline.updatedAt).toLocaleDateString()}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.sm,
  },
  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  
  titleContainer: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  
  title: {
    ...theme.textPresets.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  
  trustName: {
    ...theme.textPresets.bodySmall,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  
  specialityBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  
  specialityText: {
    ...theme.textPresets.caption,
    color: theme.colors.textInverse,
    fontWeight: '600',
    fontSize: 10,
  },
  
  description: {
    ...theme.textPresets.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
    lineHeight: 20,
  },
  
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  
  typeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  typeText: {
    ...theme.textPresets.caption,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  
  tagsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  tag: {
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
    marginLeft: theme.spacing.xs,
  },
  
  tagText: {
    ...theme.textPresets.caption,
    color: theme.colors.textSecondary,
    fontSize: 10,
  },
  
  moreTagsText: {
    ...theme.textPresets.caption,
    color: theme.colors.textLight,
    marginLeft: theme.spacing.xs,
    fontSize: 10,
  },
  
  updatedAt: {
    ...theme.textPresets.caption,
    color: theme.colors.textLight,
    textAlign: 'right',
  },
});

