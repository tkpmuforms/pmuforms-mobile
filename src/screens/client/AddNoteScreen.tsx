import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Camera, Image as ImageIcon } from 'lucide-react-native';
import ScreenHeader from '../../components/layout/ScreenHeader';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import storage from '@react-native-firebase/storage';
import Toast from 'react-native-toast-message';
import { RootStackParamList } from '../../types/navigation';
import { colors } from '../../theme/colors';
import useAuth from '../../hooks/useAuth';

type AddNoteRouteProp = RouteProp<RootStackParamList, 'AddNote'>;

const AddNoteScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<AddNoteRouteProp>();
  const { note, onSave } = route.params;
  const { user } = useAuth();

  const [noteContent, setNoteContent] = useState(note?.note || '');
  const [imageUrl, setImageUrl] = useState(note?.imageUrl || '');
  const [localImageUri, setLocalImageUri] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const uploadImageToFirebase = async (uri: string): Promise<string> => {
    const reference = storage().ref(
      `images/${user?._id}/${Date.now()}.jpg`,
    );
    const response = await fetch(uri);
    const blob = await response.blob();
    await reference.put(blob);
    return await reference.getDownloadURL();
  };

  const handleImagePick = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 500,
      maxHeight: 500,
    });

    if (result.assets && result.assets[0]) {
      const asset = result.assets[0];
      setLocalImageUri(asset.uri || '');
      setImageUrl(asset.uri || '');
    }
  };

  const handleSave = async () => {
    if (noteContent.trim() && onSave) {
      setIsSaving(true);
      try {
        let finalImageUrl = imageUrl;

        if (localImageUri) {
          finalImageUrl = await uploadImageToFirebase(localImageUri);
        }

        await onSave(noteContent, finalImageUrl);
        navigation.goBack();
      } catch (error) {
        console.error('Error saving note:', error);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to save note',
        });
      } finally {
        setIsSaving(false);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.content}>
            <ScreenHeader
              title={note ? 'Edit Note' : 'Add Note'}
              subtitle={
                note ? 'Update your note below' : 'Add a note about this client'
              }
              onBack={() => navigation.goBack()}
            />

            {/* Form */}
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.formGroup}>
                <Text style={styles.label}>Note</Text>
                <TextInput
                  style={styles.textArea}
                  value={noteContent}
                  onChangeText={setNoteContent}
                  placeholder="Enter your note here..."
                  placeholderTextColor="#94a3b8"
                  multiline
                  numberOfLines={6}
                  textAlignVertical="top"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Image (Optional)</Text>
                <TouchableOpacity
                  style={styles.imageButton}
                  onPress={handleImagePick}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <ActivityIndicator size="small" color={colors.primary} />
                  ) : imageUrl ? (
                    <>
                      <Image
                        source={{ uri: imageUrl }}
                        style={styles.imagePreview}
                      />
                      <View style={styles.changeImageOverlay}>
                        <Camera size={20} color={colors.white} />
                        <Text style={styles.changeImageText}>Change Image</Text>
                      </View>
                    </>
                  ) : (
                    <>
                      <ImageIcon size={32} color="#94a3b8" />
                      <Text style={styles.imageButtonText}>Add Image</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
              <TouchableOpacity
                style={[
                  styles.saveButton,
                  (!noteContent.trim() || isSaving) &&
                    styles.saveButtonDisabled,
                ]}
                onPress={handleSave}
                disabled={!noteContent.trim() || isSaving}
              >
                {isSaving ? (
                  <ActivityIndicator color={colors.white} />
                ) : (
                  <Text style={styles.saveButtonText}>
                    {note ? 'Update Note' : 'Add Note'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  textArea: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.borderColor,
    borderRadius: 12,
    fontSize: 14,
    color: colors.black,
    backgroundColor: '#BCBBC133',
    minHeight: 120,
  },
  imageButton: {
    height: 200,
    borderWidth: 2,
    borderColor: colors.borderColor,
    borderRadius: 12,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#BCBBC133',
    position: 'relative',
    overflow: 'hidden',
  },
  imageButtonText: {
    fontSize: 14,
    color: colors.subtitleColor,
    marginTop: 8,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  changeImageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  changeImageText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    padding: 16,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  saveButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#94a3b8',
  },
  saveButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddNoteScreen;
