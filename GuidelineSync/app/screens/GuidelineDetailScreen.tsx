import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import Pdf from 'react-native-pdf';
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
  const [pdfLoading, setPdfLoading] = useState(true);
  const [pdfError, setPdfError] = useState(false);

  const handlePdfLoadComplete = (numberOfPages: number) => {
    setPdfLoading(false);
    console.log(`PDF loaded with ${numberOfPages} pages`);
  };

  const handlePdfError = (error: any) => {
    setPdfLoading(false);
    setPdfError(true);
    console.error('PDF Error:', error);
    Alert.alert('Error', 'Failed to load PDF. Please try again.');
  };

  const renderPdfContent = () => {
    if (!guideline.url) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No PDF available for this guideline</Text>
        </View>
      );
    }

    if (pdfError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load PDF</Text>
          <Button
            title="Retry"
            onPress={() => {
              setPdfError(false);
              setPdfLoading(true);
            }}
            size="small"
            style={styles.retryButton}
          />
        </View>
      );
    }

    return (
      <Pdf
        source={{ uri: guideline.url, cache: true }}
        style={styles.pdf}
        onLoadComplete={handlePdfLoadComplete}
        onError={handlePdfError}
        onLoadProgress={(percent) => {
          console.log(`PDF loading: ${Math.round(percent * 100)}%`);
        }}
        enablePaging={true}
        spacing={10}
        fitPolicy={0}
        horizontal={false}
      />
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
        {pdfLoading && guideline.fileType === 'pdf' && (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading PDF...</Text>
          </View>
        )}
        
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
  
  pdf: {
    flex: 1,
    width: width,
    height: height - 200, // Adjust based on header/footer height
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

