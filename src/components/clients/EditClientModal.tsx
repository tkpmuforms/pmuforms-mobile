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
  ActivityIndicator,
} from 'react-native';
import { X } from 'lucide-react-native';
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
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Client details updated successfully',
      });
      onSuccess?.();
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
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.overlay}>
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
            >
              <View style={styles.formRow}>
                <View style={styles.formGroupHalf}>
                  <Text style={styles.label}>First Name</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.firstName}
                    onChangeText={value =>
                      handleInputChange('firstName', value)
                    }
                    placeholder="First Name"
                    placeholderTextColor="#94a3b8"
                  />
                </View>

                <View style={styles.formGroupHalf}>
                  <Text style={styles.label}>Last Name</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.lastName}
                    onChangeText={value => handleInputChange('lastName', value)}
                    placeholder="Last Name"
                    placeholderTextColor="#94a3b8"
                  />
                </View>
              </View>

              <View style={styles.formRow}>
                <View style={styles.formGroupHalf}>
                  <Text style={styles.label}>Email Address</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.email}
                    onChangeText={value => handleInputChange('email', value)}
                    placeholder="Email Address"
                    placeholderTextColor="#94a3b8"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.formGroupHalf}>
                  <Text style={styles.label}>Phone number</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.phone}
                    onChangeText={value => handleInputChange('phone', value)}
                    placeholder="Phone number"
                    placeholderTextColor="#94a3b8"
                    keyboardType="phone-pad"
                  />
                </View>
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
  saveButton: {
    backgroundColor: '#8e2d8e',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
    width: '60%',
    alignSelf: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.7,
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
