import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Dimensions,
  Linking,
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { theme } from '../theme';
import { Button } from '../components/Button';
import { Guideline } from '../types';

interface GuidelineDetailScreenProps {
  guideline: Guideline;
  onBack: () => void;
}

const { width, height } = Dimensions.get('window');

export const GuidelineDetailScreen: React.FC<GuidelineDetailScreenProps> = ({
  guideline,
  onBack,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenPdf = async () => {
    if (!guideline.url) {
      Alert.alert('Error', 'No PDF URL available');
      return;
    }

    try {
      setIsLoading(true);
      await WebBrowser.openBrowserAsync(guideline.url);
    } catch (error) {
      console.error('Error opening PDF:', error);
      Alert.alert('Error', 'Failed to open PDF. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderPdfContent = () => {
    if (!guideline.url) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No PDF available for this guideline</Text>
        </View>
      );
    }

    return (
      <View style={styles.pdfContainer}>
        <View style={styles.pdfInfo}>
          <Text style={styles.pdfInfoText}>
            📄 PDF Document Available
          </Text>
          <Text style={styles.pdfDescription}>
            Tap the button below to open the PDF in your browser for viewing.
          </Text>
        </View>
        
        <Button
          title={isLoading ? "Opening PDF..." : "📖 Open PDF Document"}
          onPress={handleOpenPdf}
          disabled={isLoading}
          style={styles.openPdfButton}
        />
        
        {guideline.description && (
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionTitle}>Description:</Text>
            <Text style={styles.descriptionText}>{guideline.description}</Text>
          </View>
        )}
      </View>
    );
  };

  const renderTextContent = () => {
    if (!guideline.content) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No content available for this guideline</Text>
        </View>
      );
    }

    return (
      <ScrollView style={styles.textContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.contentText}>{guideline.content}</Text>
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Button
          title="← Back"
          onPress={onBack}
          variant="ghost"
          size="small"
          style={styles.backButton}
        />
        
        <View style={styles.headerInfo}>
          <Text style={styles.title} numberOfLines={2}>
            {guideline.title}
          </Text>
          <Text style={styles.trustName}>{guideline.trustName}</Text>
          <Text style={styles.speciality}>
            {guideline.medicalSpeciality.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </Text>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {guideline.fileType === 'pdf' ? renderPdfContent() : renderTextContent()}
      </View>

      {/* Footer with metadata */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Last updated: {new Date(guideline.updatedAt).toLocaleDateString()}
        </Text>
        {guideline.tags && guideline.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            <Text style={styles.tagsLabel}>Tags: </Text>
            <Text style={styles.tagsText}>{guideline.tags.join(', ')}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  
  header: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
    ...theme.shadows.sm,
  },
  
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  
  headerInfo: {
    flex: 1,
  },
  
  title: {
    ...theme.textPresets.h2,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  
  trustName: {
    ...theme.textPresets.body,
    color: theme.colors.primary,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
  },
  
  speciality: {
    ...theme.textPresets.bodySmall,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  
  content: {
    flex: 1,
  },
  
  pdfContainer: {
    flex: 1,
    padding: theme.spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  pdfInfo: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  
  pdfInfoText: {
    fontSize: 24,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  
  pdfDescription: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  
  openPdfButton: {
    marginBottom: theme.spacing.xl,
    minWidth: 200,
  },
  
  descriptionContainer: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    width: '100%',
    maxWidth: 400,
  },
  
  descriptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  
  descriptionText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  
  textContent: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  
  contentText: {
    ...theme.textPresets.body,
    color: theme.colors.text,
    lineHeight: 24,
  },
  
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  loadingText: {
    ...theme.textPresets.body,
    color: theme.colors.textSecondary,
  },
  
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  
  errorText: {
    ...theme.textPresets.body,
    color: theme.colors.error,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  
  retryButton: {
    marginTop: theme.spacing.md,
  },
  
  footer: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.divider,
  },
  
  footerText: {
    ...theme.textPresets.caption,
    color: theme.colors.textLight,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  
  tagsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  
  tagsLabel: {
    ...theme.textPresets.caption,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  
  tagsText: {
    ...theme.textPresets.caption,
    color: theme.colors.textLight,
    flex: 1,
  },
});
