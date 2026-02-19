import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  FileText,
  Type,
  CheckSquare,
  Hash,
  Calendar,
} from 'lucide-react-native';
import { colors } from '../../theme/colors';

interface FieldType {
  type: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

const AddFieldScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { formId, sectionId, afterFieldId } = route.params as {
    formId: string;
    sectionId: string;
    afterFieldId: string;
  };

  const fieldTypes: FieldType[] = [
    {
      type: 'paragraph',
      icon: <FileText size={28} color={colors.primary} />,
      title: 'Paragraph Only',
      description: 'For texts sections without input',
    },
    {
      type: 'text',
      icon: <Type size={28} color={colors.primary} />,
      title: 'Text Field',
      description: 'For inputs like name, occupation e.t.c',
    },
    {
      type: 'checkbox',
      icon: <CheckSquare size={28} color={colors.primary} />,
      title: 'Checkbox',
      description: 'For Yes/No questions',
    },
    {
      type: 'numberOfField',
      icon: <Hash size={28} color={colors.primary} />,
      title: 'Number',
      description: 'For Numeric input like age',
    },
    {
      type: 'date',
      icon: <Calendar size={28} color={colors.primary} />,
      title: 'Date',
      description: 'For Date input like birth date',
    },
  ];

  const handleFieldTypeSelect = (fieldType: FieldType) => {
    if (fieldType.type === 'paragraph') {
      navigation.replace('EditParagraph', {
        formId,
        sectionId,
        afterFieldId,
      });
    } else {
      navigation.replace('FieldInput', {
        formId,
        sectionId,
        afterFieldId,
        fieldType: { type: fieldType.type, title: fieldType.title },
      });
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Field</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.grid}>
          {fieldTypes.map((field, index) => (
            <TouchableOpacity
              key={index}
              style={styles.fieldCard}
              onPress={() => handleFieldTypeSelect(field)}
              activeOpacity={0.7}
            >
              <View style={styles.fieldIcon}>{field.icon}</View>
              <Text style={styles.fieldTitle}>{field.title}</Text>
              <Text style={styles.fieldDescription}>{field.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
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
  placeholder: {
    width: 32,
  },
  scrollContent: {
    padding: 24,
  },
  grid: {
    gap: 16,
  },
  fieldCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  fieldIcon: {
    marginBottom: 12,
  },
  fieldTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  fieldDescription: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default AddFieldScreen;
