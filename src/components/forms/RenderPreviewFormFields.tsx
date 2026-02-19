import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Calendar } from 'lucide-react-native';

const FormInputTypes = {
  TEXT: 'text',
  CHECKBOX: 'checkbox',
  IMAGE: 'image',
  DATE: 'date',
  TEXTFIELD: 'textfield',
  NUMBER: 'numberOfField',
};

export const renderPreviewFormFields = (fields: any[]) => {
  const rows: any[][] = [];
  let currentRow: any[] = [];

  (fields || []).forEach((field: any) => {
    if (!field || !field?.id) return;
    if (field.line === 'half') {
      currentRow.push(field);
      if (currentRow.length === 2) {
        rows.push(currentRow);
        currentRow = [];
      }
    } else {
      if (currentRow.length > 0) {
        rows.push(currentRow);
        currentRow = [];
      }
      rows.push([field]);
    }
  });
  if (currentRow.length > 0) {
    rows.push(currentRow);
  }

  return rows.map((row, rowIndex) => {
    if (row.length === 2) {
      return (
        <View key={`row-${rowIndex}`} style={styles.row}>
          {row.map(field => (
            <View key={field.id} style={styles.halfField}>
              {renderSingleField(field)}
            </View>
          ))}
        </View>
      );
    }
    const field = row[0];
    const isHalf = field.line === 'half';
    return (
      <View key={`row-${rowIndex}`} style={isHalf ? styles.row : undefined}>
        <View style={isHalf ? styles.halfField : undefined}>
          {renderSingleField(field)}
        </View>
      </View>
    );
  });
};

const renderSingleField = (field: any) => {
  const isRequired = field?.required;

  if (!field?.type) {
    return (
      <View style={styles.readOnlyField}>
        <Text style={styles.readOnlyLabel}>{field?.title || 'Untitled'}</Text>
      </View>
    );
  }

  if (field?.id === 'signature') {
    return (
      <View style={styles.fieldContainer}>
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
        <View style={styles.checkboxContainer}>
          <View style={styles.checkbox} />
          <Text style={styles.checkboxLabel}>
            {field.title}
            {isRequired && <Text style={styles.required}>*</Text>}
          </Text>
        </View>
      );

    case FormInputTypes.DATE:
      return (
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>
            {field.title}
            {isRequired && <Text style={styles.required}>*</Text>}
          </Text>
          <View style={styles.dateInput}>
            <Text style={styles.datePlaceholder}>MM / DD / YYYY</Text>
            <Calendar size={18} color="#999" />
          </View>
        </View>
      );

    case FormInputTypes.IMAGE:
      return (
        <View style={styles.fieldContainer}>
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
        <View style={styles.fieldContainer}>
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
        <View style={styles.fieldContainer}>
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

    default:
      return (
        <View style={styles.fieldContainer}>
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
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfField: {
    flex: 1,
  },
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
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
  },
  datePlaceholder: {
    fontSize: 14,
    color: '#999',
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
