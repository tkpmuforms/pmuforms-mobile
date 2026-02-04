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
} from 'react-native';
import { X } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { createClient } from '../../services/artistServices';
import { colors } from '../../theme/colors';

interface AddClientModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

const AddClientModal: React.FC<AddClientModalProps> = ({
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = () => {
    return (
      formData?.firstName.trim() !== '' &&
      formData?.lastName.trim() !== '' &&
      formData?.email.trim() !== ''
    );
  };

  const handleSubmit = async () => {
    if (!isFormValid()) {
      return;
    }
    try {
      await createClient({
        name: `${formData?.firstName} ${formData?.lastName}`,
        primaryPhone: formData?.phone,
        email: formData?.email,
      });

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Client added successfully!',
      });

      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
      });
      onSuccess?.();
    } catch (error) {
      console.error('Error adding client:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to add client. Please try again.',
      });
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
                  <X size={20} color={colors.subtitleColor} />
                </TouchableOpacity>

                <View style={styles.header}>
                  <Text style={styles.title}>Add New Client</Text>
                  <Text style={styles.subtitle}>
                    Please Fill out the forms to add a new client
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
                      placeholder="First Name"
                      placeholderTextColor="#94a3b8"
                      value={formData.firstName}
                      onChangeText={value =>
                        handleInputChange('firstName', value)
                      }
                      returnKeyType="next"
                    />
                  </View>

                  <View style={styles.formGroup}>
                    <Text style={styles.label}>Last Name</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Last Name"
                      placeholderTextColor="#94a3b8"
                      value={formData.lastName}
                      onChangeText={value =>
                        handleInputChange('lastName', value)
                      }
                      returnKeyType="next"
                    />
                  </View>

                  <View style={styles.formGroup}>
                    <Text style={styles.label}>Email Address</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Email Address"
                      placeholderTextColor="#94a3b8"
                      value={formData.email}
                      onChangeText={value => handleInputChange('email', value)}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      returnKeyType="next"
                    />
                  </View>

                  <View style={styles.formGroup}>
                    <Text style={styles.label}>Phone number</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Phone number"
                      placeholderTextColor="#94a3b8"
                      value={formData.phone}
                      onChangeText={value => handleInputChange('phone', value)}
                      keyboardType="phone-pad"
                      returnKeyType="done"
                      onSubmitEditing={Keyboard.dismiss}
                    />
                  </View>
                </ScrollView>

                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    !isFormValid() && styles.submitButtonDisabled,
                  ]}
                  onPress={handleSubmit}
                  disabled={!isFormValid()}
                >
                  <Text style={styles.submitButtonText}>Add Client</Text>
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
    backgroundColor: colors.white,
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
    color: colors.black,
    lineHeight: 24,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: colors.subtitleColor,
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
    color: colors.black,
    lineHeight: 20,
    marginBottom: 8,
  },
  input: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.borderColor,
    borderRadius: 12,
    fontSize: 14,
    color: colors.black,
    backgroundColor: '#BCBBC133',
  },
  submitButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
    width: '90%',
    alignSelf: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#CBD5E1',
    opacity: 0.6,
  },
  submitButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default AddClientModal;
