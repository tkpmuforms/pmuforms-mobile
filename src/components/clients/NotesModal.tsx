import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  Image,
  ActivityIndicator,
} from 'react-native';
import { X, Camera, Image as ImageIcon } from 'lucide-react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { Note } from '../../types';

interface NotesModalProps {
  visible: boolean;
  note: Note | null;
  onClose: () => void;
  onSave: (noteContent: string, imageUrl?: string) => void;
}

const NotesModal: React.FC<NotesModalProps> = ({
  visible,
  note,
  onClose,
  onSave,
}) => {
  const [noteContent, setNoteContent] = useState(note?.note || '');
  const [imageUrl, setImageUrl] = useState(note?.imageUrl || '');
  const [isUploading, setIsUploading] = useState(false);

  const handleImagePick = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
    });

    if (result.assets && result.assets[0]) {
      const asset = result.assets[0];
      //TODO: Implement actual upload logic here

      setImageUrl(asset.uri || '');
    }
  };

  const handleSave = () => {
    if (noteContent.trim()) {
      onSave(noteContent, imageUrl);
    }
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
              <X size={20} color="#64748b" />
            </TouchableOpacity>

            <View style={styles.header}>
              <Text style={styles.title}>
                {note ? 'Edit Note' : 'Add Note'}
              </Text>
              <Text style={styles.subtitle}>
                {note
                  ? 'Update your note below'
                  : 'Add a note about this client'}
              </Text>
            </View>

            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
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
                    <ActivityIndicator size="small" color="#8e2d8e" />
                  ) : imageUrl ? (
                    <>
                      <Image
                        source={{ uri: imageUrl }}
                        style={styles.imagePreview}
                      />
                      <View style={styles.changeImageOverlay}>
                        <Camera size={20} color="#fff" />
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

            <TouchableOpacity
              style={[
                styles.submitButton,
                !noteContent.trim() && styles.submitButtonDisabled,
              ]}
              onPress={handleSave}
              disabled={!noteContent.trim()}
            >
              <Text style={styles.submitButtonText}>
                {note ? 'Update Note' : 'Add Note'}
              </Text>
            </TouchableOpacity>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    maxHeight: '90%',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 8,
    borderRadius: 8,
    zIndex: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
  scrollView: {
    maxHeight: 500,
  },
  scrollContent: {
    paddingBottom: 16,
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
    borderColor: '#e2e8f0',
    borderRadius: 12,
    fontSize: 14,
    color: '#000000',
    backgroundColor: '#f8fafc',
    minHeight: 120,
  },
  imageButton: {
    height: 200,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    position: 'relative',
    overflow: 'hidden',
  },
  imageButtonText: {
    fontSize: 14,
    color: '#64748b',
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
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#8e2d8e',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonDisabled: {
    backgroundColor: '#94a3b8',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default NotesModal;
