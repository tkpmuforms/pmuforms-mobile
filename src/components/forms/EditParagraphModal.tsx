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

interface EditParagraphModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (updatedContent: string, isRequired?: boolean) => void;
  initialContent?: string;
  initialRequired?: boolean;
  fieldType?: string;
}

const EditParagraphModal: React.FC<EditParagraphModalProps> = ({
  visible,
  onClose,
  onSave,
  initialContent = '',
  initialRequired = false,
}) => {
  const [content, setContent] = useState(initialContent);

  useEffect(() => {
    if (visible) {
      setContent(initialContent);
    }
  }, [visible, initialContent]);

  const handleSave = () => {
    onSave(content, initialRequired);
    onClose();
  };

  const handleClose = () => {
    setContent(initialContent);
    onClose();
  };

  return (
    <Modal
      style={styles.modal}
      visible={visible}
      animationType="slide"
      onRequestClose={handleClose}
    >
      <SafeAreaView
        style={styles.container}
        edges={['top', 'bottom', 'left', 'right']}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.backButton}>
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Paragraph</Text>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
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
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
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
  saveButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
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

export default EditParagraphModal;
