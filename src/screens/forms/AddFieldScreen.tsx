import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {
  FileText,
  Type,
  CheckSquare,
  Hash,
  Calendar,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import ScreenHeader from '../../components/layout/ScreenHeader';
import { colors } from '../../theme/colors';

interface FieldType {
  type: string;
  title: string;
  description: string;
}

const fieldTypes: FieldType[] = [
  {
    type: 'paragraph',
    title: 'Paragraph Only',
    description: 'For texts sections without input',
  },
  {
    type: 'text',
    title: 'Text Field',
    description: 'For inputs like name, occupation e.t.c',
  },
  {
    type: 'checkbox',
    title: 'Checkbox',
    description: 'For Yes/No questions',
  },
  {
    type: 'numberOfField',
    title: 'Number',
    description: 'For Numeric input like age',
  },
  {
    type: 'date',
    title: 'Date',
    description: 'For Date input like birth date',
  },
];

const fieldIcons: Record<string, React.ReactNode> = {
  paragraph: <FileText size={28} color={colors.primary} />,
  text: <Type size={28} color={colors.primary} />,
  checkbox: <CheckSquare size={28} color={colors.primary} />,
  numberOfField: <Hash size={28} color={colors.primary} />,
  date: <Calendar size={28} color={colors.primary} />,
};

const AddFieldScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  const handleFieldTypeSelect = (fieldType: FieldType) => {
    if (fieldType.type === 'paragraph') {
      navigation.navigate('EditParagraph', {
        initialContent: '',
      });
    } else {
      navigation.navigate('FieldInput', {
        fieldType,
      });
    }
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Add Field" onBack={() => navigation.goBack()} />
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
              <View style={styles.fieldIcon}>
                {fieldIcons[field.type]}
              </View>
              <Text style={styles.fieldTitle}>{field.title}</Text>
              <Text style={styles.fieldDescription}>{field.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
