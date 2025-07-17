import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { theme } from '../theme';
import { Guideline, MedicalSpeciality } from '../types';
import { Card } from './Card';

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
    surgery: theme.colors.surgery,
    psychiatry: theme.colors.psychiatry,
    dermatology: theme.colors.dermatology,
    orthopedics: theme.colors.orthopedics,
    radiology: theme.colors.radiology,
    pathology: theme.colors.pathology,
    anesthesiology: theme.colors.anesthesiology,
    general_medicine: theme.colors.generalMedicine,
    other: theme.colors.textSecondary,
  };
  
  return specialityColors[speciality] || theme.colors.primary;
};

const getTrustColor = (trustName: string): string => {
  const trustColors: Record<string, string> = {
    "St George's": theme.colors.stGeorges,
    "Royal London": theme.colors.royalLondon,
    "Manchester": theme.colors.manchester,
    "Birmingham": theme.colors.birmingham,
  };
  return trustColors[trustName] || theme.colors.primary;
};

const formatSpecialityName = (speciality: MedicalSpeciality): string => {
  return speciality.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
};

export const GuidelineCard: React.FC<GuidelineCardProps> = ({
  guideline,
  onPress,
}) => {
  const specialityColor = getSpecialityColor(guideline.medicalSpeciality);
  const trustColor = getTrustColor(guideline.trustName);
  
  return (
    <TouchableOpacity onPress={() => onPress(guideline)} activeOpacity={0.7}>
      <Card style={styles.container}>
        {/* Header with trust indicator and specialty badge */}
        <View style={styles.header}>
          <View style={styles.trustRow}>
            <View style={[styles.trustIndicator, { backgroundColor: trustColor }]} />
            <Text style={[styles.trustName, { color: trustColor }]}>
              {guideline.trustName}
            </Text>
          </View>
          
          <View style={[styles.specialityBadge, { backgroundColor: `${specialityColor}15` }]}>
            <Text style={[styles.specialityText, { color: specialityColor }]}>
              {formatSpecialityName(guideline.medicalSpeciality)}
            </Text>
          </View>
        </View>
        
        {/* Main content */}
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={2}>
            {guideline.title}
          </Text>
          
          {guideline.description && (
            <Text style={styles.description} numberOfLines={2}>
              {guideline.description}
            </Text>
          )}
        </View>
        
        {/* Footer with tags and metadata */}
        <View style={styles.footer}>
          <View style={styles.leftFooter}>
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
            {new Date(guideline.updatedAt).toLocaleDateString()}
          </Text>
        </View>
        
        {/* Accent border */}
        <View style={[styles.accentBorder, { backgroundColor: specialityColor }]} />
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    marginHorizontal: theme.spacing.screenMargin,
    marginVertical: theme.spacing.sm,
  },
  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  
  trustRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  
  trustIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: theme.spacing.sm,
  },
  
  trustName: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  
  specialityBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  
  specialityText: {
    fontSize: 12,
    fontWeight: '600',
  },
  
  content: {
    marginBottom: theme.spacing.md,
  },
  
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
    lineHeight: 22,
    marginBottom: theme.spacing.sm,
    fontFamily: 'SpaceGrotesk-Bold',
  },
  
  description: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  leftFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  
  typeIndicator: {
    marginRight: theme.spacing.sm,
  },
  
  typeText: {
    fontSize: 12,
    color: theme.colors.textTertiary,
    fontWeight: '500',
  },
  
  tagsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  
  tag: {
    backgroundColor: theme.colors.surfaceVariant,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    marginRight: theme.spacing.xs,
  },
  
  tagText: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  
  moreTagsText: {
    fontSize: 11,
    color: theme.colors.textTertiary,
    fontWeight: '500',
  },
  
  updatedAt: {
    fontSize: 12,
    color: theme.colors.textTertiary,
    textAlign: 'right',
  },
  
  accentBorder: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    borderTopLeftRadius: theme.borderRadius.lg,
    borderBottomLeftRadius: theme.borderRadius.lg,
  },
});
