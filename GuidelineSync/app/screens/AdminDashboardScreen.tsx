import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { theme } from '../theme';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { guidelinesApi } from '../services/api';
import { CreateGuidelineRequest, MedicalSpeciality } from '../types';

interface AdminDashboardScreenProps {
  onBack: () => void;
}

const medicalSpecialities: { value: MedicalSpeciality; label: string }[] = [
  { value: 'cardiology', label: 'Cardiology' },
  { value: 'respiratory', label: 'Respiratory' },
  { value: 'neurology', label: 'Neurology' },
  { value: 'oncology', label: 'Oncology' },
  { value: 'pediatrics', label: 'Pediatrics' },
  { value: 'emergency', label: 'Emergency Medicine' },
  { value: 'surgery', label: 'Surgery' },
  { value: 'psychiatry', label: 'Psychiatry' },
  { value: 'dermatology', label: 'Dermatology' },
  { value: 'orthopedics', label: 'Orthopedics' },
  { value: 'radiology', label: 'Radiology' },
  { value: 'pathology', label: 'Pathology' },
  { value: 'anesthesiology', label: 'Anesthesiology' },
  { value: 'general_medicine', label: 'General Medicine' },
  { value: 'other', label: 'Other' },
];

export const AdminDashboardScreen: React.FC<AdminDashboardScreenProps> = ({
  onBack,
}) => {
  const [formData, setFormData] = useState<CreateGuidelineRequest>({
    title: '',
    description: '',
    medicalSpeciality: 'general_medicine',
    trustName: '',
    content: '',
    tags: [],
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.trustName.trim()) {
      newErrors.trustName = 'Trust name is required';
    }

    if (!formData.content?.trim()) {
      newErrors.content = 'Content is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await guidelinesApi.createGuideline(formData);

      if (response.success) {
        Alert.alert(
          'Success',
          'Guideline created successfully!',
          [
            {
              text: 'OK',
              onPress: () => {
                // Reset form
                setFormData({
                  title: '',
                  description: '',
                  medicalSpeciality: 'general_medicine',
                  trustName: '',
                  content: '',
                  tags: [],
                });
              },
            },
          ]
        );
      } else {
        Alert.alert('Error', response.error || 'Failed to create guideline');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while creating the guideline');
      console.error('Create guideline error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: keyof CreateGuidelineRequest, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Button
          title="← Back"
          onPress={onBack}
          variant="ghost"
          size="small"
          style={styles.backButton}
        />
        <Text style={styles.title}>Admin Dashboard</Text>
        <Text style={styles.subtitle}>Create New Guideline</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          <Input
            label="Title"
            value={formData.title}
            onChangeText={(value) => updateFormData('title', value)}
            placeholder="Enter guideline title"
            error={errors.title}
            required
          />

          <Input
            label="Trust Name"
            value={formData.trustName}
            onChangeText={(value) => updateFormData('trustName', value)}
            placeholder="e.g., St George's Hospital"
            error={errors.trustName}
            required
          />

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Medical Speciality <Text style={styles.required}>*</Text>
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.specialityContainer}
            >
              {medicalSpecialities.map((speciality) => (
                <Button
                  key={speciality.value}
                  title={speciality.label}
                  onPress={() => updateFormData('medicalSpeciality', speciality.value)}
                  variant={
                    formData.medicalSpeciality === speciality.value ? 'primary' : 'outline'
                  }
                  size="small"
                  style={styles.specialityButton}
                />
              ))}
            </ScrollView>
          </View>

          <Input
            label="Description"
            value={formData.description}
            onChangeText={(value) => updateFormData('description', value)}
            placeholder="Brief description of the guideline"
            multiline
            numberOfLines={3}
            style={styles.textArea}
          />

          <Input
            label="Content"
            value={formData.content}
            onChangeText={(value) => updateFormData('content', value)}
            placeholder="Enter the full guideline content here..."
            multiline
            numberOfLines={10}
            style={styles.textArea}
            error={errors.content}
            required
          />

          <Input
            label="Tags"
            value={formData.tags?.join(', ') || ''}
            onChangeText={(value) =>
              updateFormData('tags', value.split(',').map(tag => tag.trim()).filter(Boolean))
            }
            placeholder="emergency, acute care, protocol (comma-separated)"
            helperText="Separate tags with commas"
          />

          <Button
            title="Create Guideline"
            onPress={handleSubmit}
            loading={loading}
            disabled={loading}
            style={styles.submitButton}
          />
        </View>
      </ScrollView>
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

  title: {
    ...theme.textPresets.h2,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },

  subtitle: {
    ...theme.textPresets.body,
    color: theme.colors.textSecondary,
  },

  content: {
    flex: 1,
  },

  form: {
    padding: theme.spacing.lg,
  },

  inputGroup: {
    marginBottom: theme.spacing.md,
  },

  label: {
    ...theme.textPresets.bodySmall,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    fontWeight: '500',
  },

  required: {
    color: theme.colors.error,
  },

  specialityContainer: {
    flexDirection: 'row',
  },

  specialityButton: {
    marginRight: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },

  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },

  submitButton: {
    marginTop: theme.spacing.lg,
  },
});

