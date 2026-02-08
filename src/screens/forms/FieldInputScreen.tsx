import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import ScreenHeader from '../../components/layout/ScreenHeader';
import { colors } from '../../theme/colors';

const FieldInputScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const {
    fieldType = { type: 'text', title: 'Field' },
    initialTitle = '',
    initialRequired = false,
  } = route.params || {};

  const [title, setTitle] = useState(initialTitle);
  const [isRequired, setIsRequired] = useState(initialRequired);

  const handleSave = () => {
    if (!title.trim()) return;
    navigation.navigate('FormEdit', {
      fieldInputResult: { title: title.trim(), isRequired, fieldType },
    });
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title={`${initialTitle ? 'Edit' : 'Add'} ${fieldType.title}`}
        onBack={() => navigation.goBack()}
        rightComponent={
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
        }
      />
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
