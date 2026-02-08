import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { colors } from '../../theme/colors';

interface FieldInputModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (title: string, isRequired: boolean) => void;
  fieldType: {
    type: string;
    title: string;
  };
  initialTitle?: string;
  initialRequired?: boolean;
}

const FieldInputModal: React.FC<FieldInputModalProps> = ({
  visible,
  onClose,
  onSave,
  fieldType,
  initialTitle = '',
  initialRequired = false,
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [isRequired, setIsRequired] = useState(initialRequired);

  useEffect(() => {
    if (visible) {
      setTitle(initialTitle);
      setIsRequired(initialRequired);
    }
  }, [visible, initialTitle, initialRequired]);

  const handleSave = () => {
    if (!title.trim()) {
      return;
    }
    onSave(title.trim(), isRequired);
    onClose();
  };

  const handleClose = () => {
    setTitle(initialTitle);
    setIsRequired(initialRequired);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={handleClose}>
      <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.backButton}>
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {initialTitle ? 'Edit' : 'Add'} {fieldType.title}
          </Text>
          <TouchableOpacity
            style={[
              styles.saveButton,
              !title.trim() && styles.saveButtonDisabled,
            ]}
            onPress={handleSave}
            disabled={!title.trim()}
          >
            <Text
              style={[
                styles.saveButtonText,
                !title.trim() && styles.saveButtonTextDisabled,
              ]}
            >
              {initialTitle ? 'Save' : 'Add'}
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
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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

export default FieldInputModal;
