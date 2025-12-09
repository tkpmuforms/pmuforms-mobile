import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Alert,
} from 'react-native';
import { X, Eye, EyeOff } from 'lucide-react-native';
import { useDispatch } from 'react-redux';
import useAuth from '../../hooks/useAuth';
import { setUser } from '../../redux/auth';
import { getAuthMe, updateBusinessName } from '../../services/artistServices';

interface EditBusinessNameModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: () => void;
}

const EditBusinessNameModal: React.FC<EditBusinessNameModalProps> = ({
  visible,
  onClose,
  onSave,
}) => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const [businessName, setBusinessName] = useState(user?.businessName || '');
  const [showPassword, setShowPassword] = useState(false);

  const handleSave = async () => {
    if (!businessName.trim()) {
      Alert.alert('Error', 'Business name cannot be empty');
      return;
    }

    try {
      await updateBusinessName({ businessName });
      await getAuthUser();
      Alert.alert('Success', 'Business name updated successfully!');
      onSave();
    } catch (error) {
      console.error('Error saving business name:', error);
      Alert.alert('Error', 'Failed to save business name');
    }
  };

  const getAuthUser = async () => {
    try {
      const response = await getAuthMe();
      dispatch(setUser(response?.data?.user));
    } catch (error) {
      console.error('Error fetching auth user:', error);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={20} color="#64748b" />
            </TouchableOpacity>

            <Text style={styles.title}>Edit Business Name</Text>

            <View style={styles.form}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Business Name</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    value={businessName}
                    onChangeText={setBusinessName}
                    placeholder="Enter business name"
                    placeholderTextColor="#94a3b8"
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff size={16} color="#64748b" />
                    ) : (
                      <Eye size={16} color="#64748b" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save Changes</Text>
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
    justifyContent: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 32,
    maxWidth: 500,
    width: '100%',
    alignSelf: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 8,
    borderRadius: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 24,
    textAlign: 'center',
  },
  form: {
    marginBottom: 24,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  inputWrapper: {
    position: 'relative',
  },
  input: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    paddingRight: 48,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    fontSize: 14,
    color: '#1e293b',
    backgroundColor: '#f8fafc',
  },
  iconButton: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: [{ translateY: -8 }],
    padding: 4,
    borderRadius: 4,
  },
  saveButton: {
    backgroundColor: '#A858F0',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default EditBusinessNameModal;
