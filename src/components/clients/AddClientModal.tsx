import React, { useState } from 'react';
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
import { X } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { createClient } from '../../services/artistServices';

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

  const handleSubmit = async () => {
    try {
      await createClient({
        name: `${formData.firstName} ${formData.lastName}`,
        primaryPhone: formData.phone,
        email: formData.email,
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
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={20} color="#64748b" />
            </TouchableOpacity>

            <View style={styles.header}>
              <Text style={styles.title}>Add a New Client</Text>
              <Text style={styles.subtitle}>
                Please provide the necessary information to onboard a new
                client.
              </Text>
            </View>

            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.formRow}>
                <View style={styles.formGroupHalf}>
                  <Text style={styles.label}>First Name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="First Name"
                    placeholderTextColor="#94a3b8"
                    value={formData.firstName}
                    onChangeText={value =>
                      handleInputChange('firstName', value)
                    }
                  />
                </View>

                <View style={styles.formGroupHalf}>
                  <Text style={styles.label}>Last Name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Last Name"
                    placeholderTextColor="#94a3b8"
                    value={formData.lastName}
                    onChangeText={value => handleInputChange('lastName', value)}
                  />
                </View>
              </View>

              <View style={styles.formRow}>
                <View style={styles.formGroupHalf}>
                  <Text style={styles.label}>Email Address</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Email Address"
                    placeholderTextColor="#94a3b8"
                    value={formData.email}
                    onChangeText={value => handleInputChange('email', value)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.formGroupHalf}>
                  <Text style={styles.label}>Phone number</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Phone number"
                    placeholderTextColor="#94a3b8"
                    value={formData.phone}
                    onChangeText={value => handleInputChange('phone', value)}
                    keyboardType="phone-pad"
                  />
                </View>
              </View>
            </ScrollView>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Add Client</Text>
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
    padding: 32,
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
    lineHeight: 20,
  },
  scrollView: {
    maxHeight: 400,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  formGroupHalf: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
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
    backgroundColor: '#f8fafc',
  },
  submitButton: {
    backgroundColor: '#8e2d8e',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
    width: '60%',
    alignSelf: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default AddClientModal;
