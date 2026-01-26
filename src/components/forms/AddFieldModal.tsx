import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  X,
  FileText,
  Type,
  CheckSquare,
  Hash,
  Calendar,
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface FieldType {
  type: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface AddFieldModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectFieldType: (fieldType: FieldType) => void;
}

const AddFieldModal: React.FC<AddFieldModalProps> = ({
  visible,
  onClose,
  onSelectFieldType,
}) => {
  const fieldTypes: FieldType[] = [
    {
      type: 'paragraph',
      icon: <FileText size={28} color="#8e2d8e" />,
      title: 'Paragraph Only',
      description: 'For texts sections without input',
    },
    {
      type: 'text',
      icon: <Type size={28} color="#8e2d8e" />,
      title: 'Text Field',
      description: 'For inputs like name, occupation e.t.c',
    },
    {
      type: 'checkbox',
      icon: <CheckSquare size={28} color="#8e2d8e" />,
      title: 'Checkbox',
      description: 'For Yes/No questions',
    },
    {
      type: 'numberOfField',
      icon: <Hash size={28} color="#8e2d8e" />,
      title: 'Number',
      description: 'For Numeric input like age',
    },
    {
      type: 'date',
      icon: <Calendar size={28} color="#8e2d8e" />,
      title: 'Date',
      description: 'For Date input like birth date',
    },
  ];

  const handleFieldTypeSelect = (fieldType: FieldType) => {
    onSelectFieldType(fieldType);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={24} color="#64748b" />
            </TouchableOpacity>

            <ScrollView
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.title}>Add Field</Text>
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
                    <Text style={styles.fieldDescription}>
                      {field.description}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    paddingTop: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    padding: 8,
    borderRadius: 8,
  },
  scrollContent: {
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 24,
    textAlign: 'center',
  },
  grid: {
    gap: 16,
  },
  fieldCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
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
    color: '#0f0f0f',
    marginBottom: 8,
    textAlign: 'center',
  },
  fieldDescription: {
    fontSize: 14,
    color: '#707070',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default AddFieldModal;
