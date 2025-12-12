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
  Alert,
  ActivityIndicator,
} from 'react-native';
import { X, Camera } from 'lucide-react-native';
import { useDispatch } from 'react-redux';
// import { launchImageLibrary } from 'react-native-image-picker';
import useAuth from '../../hooks/useAuth';
import { setUser } from '../../redux/auth';
import { updateBusinessInfo, getAuthMe } from '../../services/artistServices';

interface EditBusinessInformationModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: () => void;
}

const EditBusinessInformationModal: React.FC<
  EditBusinessInformationModalProps
> = ({ visible, onClose, onSave }) => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const [businessName, setBusinessName] = useState(user?.businessName || '');
  const [phoneNumber, setPhoneNumber] = useState(
    user?.businessPhoneNumber || '',
  );
  const [address, setAddress] = useState(user?.businessAddress || '');
  const [website, setWebsite] = useState(user?.website || '');
  const [logoUri, setLogoUri] = useState(user?.avatarUrl || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleLogoChange = () => {
    // launchImageLibrary(
    //   {
    //     mediaType: 'photo',
    //     quality: 0.8,
    //     maxWidth: 500,
    //     maxHeight: 500,
    //   },
    //   (response) => {
    //     if (response.assets && response.assets[0]) {
    //       setLogoUri(response.assets[0].uri || '');
    //     }
    //   }
    // );
  };

  const handleSave = async () => {
    if (!businessName.trim()) {
      Alert.alert('Error', 'Business name cannot be empty');
      return;
    }

    setIsSaving(true);

    const businessData = {
      businessName: businessName.trim(),
      businessPhoneNumber: phoneNumber.trim(),
      businessAddress: address.trim(),
      website: website.trim(),
    };

    try {
      await updateBusinessInfo(businessData);
      const response = await getAuthMe();
      dispatch(setUser(response?.data?.user));
      Alert.alert('Success', 'Business information updated successfully!');
      onSave();
    } catch (error) {
      console.error('Error saving business information:', error);
      const err = error as any;
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to update business information';
      Alert.alert('Error', errorMessage);
    } finally {
      setIsSaving(false);
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

            <Text style={styles.title}>Edit Business Information</Text>

            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Logo Upload */}
              <View style={styles.logoSection}>
                <TouchableOpacity
                  style={styles.logoContainer}
                  onPress={handleLogoChange}
                >
                  {logoUri ? (
                    <Image source={{ uri: logoUri }} style={styles.logoImage} />
                  ) : (
                    <View style={styles.logoPlaceholder}>
                      <Text style={styles.logoPlaceholderText}>
                        Upload Business Logo
                      </Text>
                    </View>
                  )}
                  <View style={styles.editIconContainer}>
                    <Camera size={16} color="#fff" />
                  </View>
                </TouchableOpacity>
              </View>

              {/* Form Fields */}
              <View style={styles.formRow}>
                <View style={styles.formGroupHalf}>
                  <Text style={styles.label}>Business Name</Text>
                  <TextInput
                    style={styles.input}
                    value={businessName}
                    onChangeText={setBusinessName}
                    placeholder="Business Name"
                    placeholderTextColor="#9ca3af"
                  />
                </View>

                <View style={styles.formGroupHalf}>
                  <Text style={styles.label}>Email</Text>
                  <TextInput
                    style={[styles.input, styles.inputDisabled]}
                    value={user?.email || ''}
                    placeholder="Email"
                    placeholderTextColor="#9ca3af"
                    editable={false}
                  />
                </View>
              </View>

              <View style={styles.formRow}>
                <View style={styles.formGroupHalf}>
                  <Text style={styles.label}>Business Phone Number</Text>
                  <TextInput
                    style={styles.input}
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    placeholder="Business Phone Number"
                    placeholderTextColor="#9ca3af"
                    keyboardType="phone-pad"
                  />
                </View>

                <View style={styles.formGroupHalf}>
                  <Text style={styles.label}>Business Address</Text>
                  <TextInput
                    style={styles.input}
                    value={address}
                    onChangeText={setAddress}
                    placeholder="Business Address"
                    placeholderTextColor="#9ca3af"
                  />
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Business Website</Text>
                <TextInput
                  style={styles.input}
                  value={website}
                  onChangeText={setWebsite}
                  placeholder="Business Website"
                  placeholderTextColor="#9ca3af"
                  keyboardType="url"
                  autoCapitalize="none"
                />
              </View>
            </ScrollView>

            <TouchableOpacity
              style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <ActivityIndicator color="#fff" />
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
    justifyContent: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 32,
    marginHorizontal: 20,
    maxHeight: '90%',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 8,
    borderRadius: 20,
    zIndex: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 24,
    textAlign: 'center',
  },
  scrollView: {
    maxHeight: 500,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoContainer: {
    position: 'relative',
  },
  logoImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  logoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#8E2D8E1A',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  logoPlaceholderText: {
    color: '#7D7D7D',
    fontSize: 12,
    textAlign: 'center',
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#A858F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  formGroupHalf: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
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
    color: '#1e293b',
    backgroundColor: '#fff',
  },
  inputDisabled: {
    backgroundColor: '#f5f5f5',
    color: '#9ca3af',
  },
  saveButton: {
    backgroundColor: '#A858F0',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EditBusinessInformationModal;
