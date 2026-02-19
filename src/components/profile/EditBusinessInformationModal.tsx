import { Camera, X } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { launchImageLibrary } from 'react-native-image-picker';
import useAuth from '../../hooks/useAuth';
import { setUser } from '../../redux/auth';
import { getAuthMe, updateBusinessInfo } from '../../services/artistServices';
import { colors } from '../../theme/colors';

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
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.8,
        maxWidth: 500,
        maxHeight: 500,
      },
      response => {
        if (response.assets && response.assets[0]) {
          setLogoUri(response.assets[0].uri || '');
        }
      },
    );
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
                  <Text style={styles.title}>Edit Business Information</Text>
                  <Text style={styles.subtitle}>
                    Please update your business information
                  </Text>
                </View>

                <ScrollView
                  style={styles.scrollView}
                  contentContainerStyle={styles.scrollContent}
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                >
                  {/* Logo Upload */}
                  <View style={styles.logoSection}>
                    <TouchableOpacity
                      style={styles.logoContainer}
                      onPress={handleLogoChange}
                    >
                      {logoUri ? (
                        <Image
                          source={{ uri: logoUri }}
                          style={styles.logoImage}
                        />
                      ) : (
                        <View style={styles.logoPlaceholder}>
                          <Text style={styles.logoPlaceholderText}>
                            Upload Business Logo
                          </Text>
                        </View>
                      )}
                      <View style={styles.editIconContainer}>
                        <Camera size={16} color={colors.white} />
                      </View>
                    </TouchableOpacity>
                  </View>

                  {/* Form Fields */}
                  <View style={styles.formGroup}>
                    <Text style={styles.label}>Business Name</Text>
                    <TextInput
                      style={styles.input}
                      value={businessName}
                      onChangeText={setBusinessName}
                      placeholder="Business Name"
                      placeholderTextColor="#94a3b8"
                      returnKeyType="next"
                    />
                  </View>

                  <View style={styles.formGroup}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                      style={[styles.input, styles.inputDisabled]}
                      value={user?.email || ''}
                      placeholder="Email"
                      placeholderTextColor="#94a3b8"
                      editable={false}
                    />
                  </View>

                  <View style={styles.formGroup}>
                    <Text style={styles.label}>Business Phone Number</Text>
                    <TextInput
                      style={styles.input}
                      value={phoneNumber}
                      onChangeText={setPhoneNumber}
                      placeholder="Business Phone Number"
                      placeholderTextColor="#94a3b8"
                      keyboardType="phone-pad"
                      returnKeyType="next"
                    />
                  </View>

                  <View style={styles.formGroup}>
                    <Text style={styles.label}>Business Address</Text>
                    <TextInput
                      style={styles.input}
                      value={address}
                      onChangeText={setAddress}
                      placeholder="Business Address"
                      placeholderTextColor="#94a3b8"
                      returnKeyType="next"
                    />
                  </View>

                  <View style={styles.formGroup}>
                    <Text style={styles.label}>Business Website</Text>
                    <TextInput
                      style={styles.input}
                      value={website}
                      onChangeText={setWebsite}
                      placeholder="Business Website"
                      placeholderTextColor="#94a3b8"
                      keyboardType="url"
                      autoCapitalize="none"
                      returnKeyType="done"
                      onSubmitEditing={Keyboard.dismiss}
                    />
                  </View>
                </ScrollView>

                <TouchableOpacity
                  style={[
                    styles.saveButton,
                    isSaving && styles.saveButtonDisabled,
                  ]}
                  onPress={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <ActivityIndicator color={colors.white} />
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
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
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
  inputDisabled: {
    backgroundColor: '#BCBBC133',
    color: '#9ca3af',
  },
  saveButton: {
    backgroundColor: colors.primary,
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
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default EditBusinessInformationModal;
