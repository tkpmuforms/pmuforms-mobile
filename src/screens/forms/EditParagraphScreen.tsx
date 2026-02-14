import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { colors } from '../../theme/colors';
import {
  addFormSectionData,
  updateFormSectionData,
} from '../../services/artistServices';

const EditParagraphScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const {
    formId,
    sectionId,
    afterFieldId,
    fieldId,
    initialContent = '',
    initialRequired = false,
    fieldLine,
  } = route.params as {
    formId: string;
    sectionId: string;
    afterFieldId: string;
    fieldId?: string;
    initialContent?: string;
    initialRequired?: boolean;
    fieldLine?: string;
  };

  const isEditing = !!fieldId;
  const [content, setContent] = useState(initialContent);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (saving) return;

    setSaving(true);
    try {
      if (isEditing) {
        await updateFormSectionData(formId, sectionId, fieldId!, {
          title: content,
          line: fieldLine || 'full',
        });
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Paragraph updated successfully',
        });
      } else {
        await addFormSectionData(formId, sectionId, {
          type: 'paragraph',
          title: content,
          line: 'full',
          after: afterFieldId,
        });
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Paragraph added successfully',
        });
      }
      navigation.goBack();
    } catch (error) {
      console.error('Error saving paragraph:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to save paragraph',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {isEditing ? 'Edit' : 'Add'} Paragraph
          </Text>
          <TouchableOpacity
            style={[styles.saveButton, saving && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={saving}
          >
            <Text
              style={[
                styles.saveButtonText,
                saving && styles.saveButtonTextDisabled,
              ]}
            >
              Save
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.body}
          contentContainerStyle={styles.bodyContent}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.label}>Content</Text>
          <TextInput
            style={styles.textarea}
            value={content}
            onChangeText={setContent}
            placeholder="Enter your paragraph content..."
            placeholderTextColor={colors.textLight}
            multiline
            textAlignVertical="top"
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 10,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  saveButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  saveButtonDisabled: {
    backgroundColor: colors.border,
  },
  saveButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  saveButtonTextDisabled: {
    color: colors.textLight,
  },
  body: {
    flex: 1,
  },
  bodyContent: {
    padding: 10,
    flexGrow: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  textarea: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.white,
    flex: 1,
    minHeight: 200,
  },
});

export default EditParagraphScreen;
