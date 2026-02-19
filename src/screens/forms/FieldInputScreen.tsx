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

const FieldInputScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const {
    formId,
    sectionId,
    afterFieldId,
    fieldType,
    fieldId,
    initialTitle = '',
    initialRequired = false,
    fieldLine,
  } = route.params as {
    formId: string;
    sectionId: string;
    afterFieldId: string;
    fieldType: { type: string; title: string };
    fieldId?: string;
    initialTitle?: string;
    initialRequired?: boolean;
    fieldLine?: string;
  };

  const isEditing = !!fieldId;
  const [title, setTitle] = useState(initialTitle);
  const [isRequired, setIsRequired] = useState(initialRequired);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!title.trim() || saving) return;

    setSaving(true);
    try {
      if (isEditing) {
        await updateFormSectionData(formId, sectionId, fieldId!, {
          title: title.trim(),
          line: fieldLine || 'full',
          required: isRequired,
        });
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Field updated successfully',
        });
      } else {
        await addFormSectionData(formId, sectionId, {
          type: fieldType.type,
          title: title.trim(),
          line: 'full',
          required: isRequired,
          after: afterFieldId,
        });
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Field added successfully',
        });
      }
      navigation.goBack();
    } catch (error) {
      console.error('Error saving field:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to save field',
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
            {isEditing ? 'Edit' : 'Add'} {fieldType.title}
          </Text>
          <TouchableOpacity
            style={[
              styles.saveButton,
              (!title.trim() || saving) && styles.saveButtonDisabled,
            ]}
            onPress={handleSave}
            disabled={!title.trim() || saving}
          >
            <Text
              style={[
                styles.saveButtonText,
                (!title.trim() || saving) && styles.saveButtonTextDisabled,
              ]}
            >
              {isEditing ? 'Save' : 'Add'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.body}
          contentContainerStyle={styles.bodyContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.formGroup}>
            <Text style={styles.label}>Field Title</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder={`Enter ${fieldType.title.toLowerCase()} title...`}
              placeholderTextColor={colors.textLight}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={handleSave}
            />
          </View>

          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setIsRequired(!isRequired)}
            activeOpacity={0.7}
          >
            <View style={styles.checkboxWrapper}>
              <View
                style={[styles.checkbox, isRequired && styles.checkboxChecked]}
              >
                {isRequired && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.checkboxLabel}>Required field</Text>
            </View>
          </TouchableOpacity>
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
    padding: 4,
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
    padding: 20,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.white,
  },
  checkboxContainer: {
    paddingVertical: 12,
  },
  checkboxWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkmark: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 16,
    color: colors.text,
  },
});

export default FieldInputScreen;
