import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from 'react-native';
import { X, Check } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { ClientDetail } from '../../types';
import { updateCustomerPersonalDetails } from '../../services/artistServices';

interface EditClientModalProps {
  client: ClientDetail;
  onClose: () => void;
  onSuccess?: () => void;
}

const EditClientModal: React.FC<EditClientModalProps> = ({
  client,
  onClose,
  onSuccess,
}) => {
  const nameParts = client.name.split(' ');
  const [formData, setFormData] = useState({
    firstName: nameParts[0] || '',
    lastName: nameParts.slice(1).join(' ') || '',
    email: client.email || '',
    phone: client.phone || '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    const updatedData = {
      name: formData.firstName + ' ' + formData.lastName,
      primaryPhone: formData.phone,
      email: formData.email,
    };

    try {
      await updateCustomerPersonalDetails(client.id, updatedData);
      setSuccess(true);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Client details updated successfully',
      });

      // Wait a bit to show the success state, then close
      setTimeout(() => {
        onSuccess?.();
      }, 1000);
    } catch (error) {
      console.error('Error updating client:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to update client details',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={true}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback onPress={e => e.stopPropagation()}>
              <View style={styles.modal}>
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                  <X size={20} color="#64748b" />
                </TouchableOpacity>

                <View style={styles.header}>
                  <Text style={styles.title}>Edit Client Details</Text>
                  <Text style={styles.subtitle}>
                    Please update the client's information.
                  </Text>
                </View>

                <ScrollView
                  style={styles.scrollView}
                  contentContainerStyle={styles.scrollContent}
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                >
                  <View style={styles.formGroup}>
                    <Text style={styles.label}>First Name</Text>
                    <TextInput
                      style={styles.input}
                      value={formData.firstName}
                      onChangeText={value =>
                        handleInputChange('firstName', value)
                      }
                      placeholder="First Name"
                      placeholderTextColor="#94a3b8"
                      returnKeyType="next"
                    />
                  </View>

                  <View style={styles.formGroup}>
                    <Text style={styles.label}>Last Name</Text>
                    <TextInput
                      style={styles.input}
                      value={formData.lastName}
                      onChangeText={value => handleInputChange('lastName', value)}
                      placeholder="Last Name"
                      placeholderTextColor="#94a3b8"
                      returnKeyType="next"
                    />
                  </View>

                  <View style={styles.formGroup}>
                    <Text style={styles.label}>Email Address</Text>
                    <TextInput
                      style={styles.input}
                      value={formData.email}
                      onChangeText={value => handleInputChange('email', value)}
                      placeholder="Email Address"
                      placeholderTextColor="#94a3b8"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      returnKeyType="next"
                    />
                  </View>

                  <View style={styles.formGroup}>
                    <Text style={styles.label}>Phone number</Text>
                    <TextInput
                      style={styles.input}
                      value={formData.phone}
                      onChangeText={value => handleInputChange('phone', value)}
                      placeholder="Phone number"
                      placeholderTextColor="#94a3b8"
                      keyboardType="phone-pad"
                      returnKeyType="done"
                      onSubmitEditing={Keyboard.dismiss}
                    />
                  </View>
                </ScrollView>

                <TouchableOpacity
                  style={[styles.saveButton, loading && styles.saveButtonDisabled]}
                  onPress={handleSave}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : success ? (
                    <View style={styles.successState}>
                      <Check size={16} color="#fff" />
                      <Text style={styles.saveButtonText}>Saved</Text>
                    </View>
                  ) : (
                    <Text style={styles.saveButtonText}>Save Changes</Text>
                  )}
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
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
    paddingTop: 15,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 40,
    maxHeight: '75%',
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
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    lineHeight: 24,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
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
    color: '#000000',
    lineHeight: 20,
    marginBottom: 8,
  },
  input: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    fontSize: 14,
    color: '#000000',
    backgroundColor: '#BCBBC133',
  },
  saveButton: {
    backgroundColor: '#8e2d8e',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
    width: '90%',
    alignSelf: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#CBD5E1',
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  successState: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});

export default EditClientModal;
