import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const FormInputTypes = {
  TEXT: 'text',
  CHECKBOX: 'checkbox',
  IMAGE: 'image',
  DATE: 'date',
  TEXTFIELD: 'textfield',
  NUMBER: 'numberOfField',
};

export const renderPreviewFormFields = (fields: any[]) =>
  (fields || []).map((field: any) => {
    if (!field || !field?.id) return null;
    const isRequired = field?.required;

    if (!field?.type) {
      return (
        <View
          key={field?.id || Math.random().toString()}
          style={styles.readOnlyField}
        >
          <Text style={styles.readOnlyLabel}>{field?.title || 'Untitled'}</Text>
        </View>
      );
    }

    if (field?.id === 'signature') {
      return (
        <View key={field.id} style={styles.fieldContainer}>
          <Text style={styles.label}>
            {field?.title || 'Signature'}
            {isRequired && <Text style={styles.required}>*</Text>}
          </Text>
          <TextInput
            style={styles.input}
            editable={false}
            placeholder="Signature field"
            placeholderTextColor="#999"
          />
        </View>
      );
    }

    switch (field.type) {
      case FormInputTypes.CHECKBOX:
        return (
          <View key={field.id} style={styles.checkboxContainer}>
            <View style={styles.checkbox} />
            <Text style={styles.checkboxLabel}>
              {field.title}
              {isRequired && <Text style={styles.required}>*</Text>}
            </Text>
          </View>
        );

      case FormInputTypes.DATE:
        return (
          <View key={field.id} style={styles.fieldContainer}>
            <Text style={styles.label}>
              {field.title}
              {isRequired && <Text style={styles.required}>*</Text>}
            </Text>
            <TextInput
              style={styles.input}
              editable={false}
              placeholder="Select date"
              placeholderTextColor="#999"
            />
          </View>
        );

      case FormInputTypes.IMAGE:
        return (
          <View key={field.id} style={styles.fieldContainer}>
            <Text style={styles.label}>
              {field.title}
              {isRequired && <Text style={styles.required}>*</Text>}
            </Text>
            <View style={styles.imageUpload}>
              <Text style={styles.imageUploadText}>Image upload area</Text>
            </View>
          </View>
        );

      case FormInputTypes.NUMBER:
        return (
          <View key={field.id} style={styles.fieldContainer}>
            <Text style={styles.label}>
              {field.title}
              {isRequired && <Text style={styles.required}>*</Text>}
            </Text>
            <TextInput
              style={styles.input}
              editable={false}
              keyboardType="numeric"
              placeholder="Enter number"
              placeholderTextColor="#999"
            />
          </View>
        );

      case FormInputTypes.TEXTFIELD:
        return (
          <View key={field.id} style={styles.fieldContainer}>
            <Text style={styles.label}>
              {field.title}
              {isRequired && <Text style={styles.required}>*</Text>}
            </Text>
            <TextInput
              style={[styles.input, styles.textarea]}
              editable={false}
              multiline
              numberOfLines={4}
              placeholder="Enter text"
              placeholderTextColor="#999"
            />
          </View>
        );

      default:
        return (
          <View key={field.id} style={styles.fieldContainer}>
            <Text style={styles.label}>
              {field.title}
              {isRequired && <Text style={styles.required}>*</Text>}
            </Text>
            <TextInput
              style={styles.input}
              editable={false}
              placeholder="Enter text"
              placeholderTextColor="#999"
            />
          </View>
        );
    }
  });

const styles = StyleSheet.create({
  readOnlyField: {
    marginBottom: 16,
  },
  readOnlyLabel: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    fontWeight: '500',
  },
  required: {
    color: '#ef4444',
    marginLeft: 4,
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#999',
  },
  textarea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 4,
    backgroundColor: '#BCBBC133',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  imageUpload: {
    backgroundColor: '#BCBBC133',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageUploadText: {
    fontSize: 14,
    color: '#999',
  },
});
