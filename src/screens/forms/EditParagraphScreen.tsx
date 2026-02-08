import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import ScreenHeader from '../../components/layout/ScreenHeader';
import { colors } from '../../theme/colors';

const EditParagraphScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const {
    initialContent = '',
    initialRequired = false,
  } = route.params || {};

  const [content, setContent] = useState(initialContent);

  const handleSave = () => {
    navigation.navigate('FormEdit', {
      paragraphResult: { content },
    });
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Edit Paragraph"
        onBack={() => navigation.goBack()}
        rightComponent={
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        }
      />
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
          autoFocus
        />
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
  saveButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  body: {
    flex: 1,
  },
  bodyContent: {
    padding: 20,
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
