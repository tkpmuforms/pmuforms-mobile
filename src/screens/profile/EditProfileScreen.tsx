import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, Edit3 } from 'lucide-react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import Toast from 'react-native-toast-message';
import { colors } from '../../theme/colors';
import useAuth from '../../hooks/useAuth';
import SignatureModal from '../../components/signature/SignatureModal';
import {
  getMyProfile,
  updateMyProfile,
  updateMySignature,
} from '../../services/artistServices';
import storage from '@react-native-firebase/storage';

interface ProfileData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
}

interface ValidationErrors {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  email?: string;
}

const EditProfileScreen: React.FC = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phoneNumber: user?.phoneNumber || '',
    email: user?.email || '',
  });
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {},
  );
  const [showSignModal, setShowSignModal] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await getMyProfile();

      const newProfileData = {
        firstName: response?.data?.profile?.firstName || user?.firstName || '',
        lastName: response?.data?.profile?.lastName || user?.lastName || '',
        phoneNumber: response?.data?.profile?.phone || user?.phoneNumber || '',
        email: response?.data?.profile?.email || user?.email || '',
      };

      setProfileData(newProfileData);

      if (response?.data?.avatarUrl) {
        setAvatarUrl(response.data.avatarUrl);
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      setError('Failed to load profile data');
    } finally {
      setIsLoading(false);
    }
  };

  const validateName = (name: string): string | undefined => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      return 'This field is required';
    }
    if (trimmedName.length < 2) {
      return 'Name must be at least 2 characters long';
    }
    if (!/^[a-zA-Z\s'-]+$/.test(trimmedName)) {
      return 'Name can only contain letters, spaces, hyphens, and apostrophes';
    }
    return undefined;
  };

  const validateUSAPhone = (phone: string): string | undefined => {
    if (!phone.trim()) {
      return undefined;
    }

    const digits = phone.replace(/\D/g, '');

    if (digits.length === 10) {
      const areaCode = digits.substring(0, 3);
      const exchange = digits.substring(3, 6);

      if (areaCode[0] === '0' || areaCode[0] === '1') {
        return 'Invalid area code';
      }

      if (exchange[0] === '0' || exchange[0] === '1') {
        return 'Invalid phone number format';
      }

      return undefined;
    } else if (digits.length === 11 && digits[0] === '1') {
      const areaCode = digits.substring(1, 4);
      const exchange = digits.substring(4, 7);

      if (areaCode[0] === '0' || areaCode[0] === '1') {
        return 'Invalid area code';
      }

      if (exchange[0] === '0' || exchange[0] === '1') {
        return 'Invalid phone number format';
      }

      return undefined;
    }

    return 'Please enter a valid USA phone number (10 digits)';
  };

  const validateEmail = (email: string): string | undefined => {
    if (!email.trim()) {
      return undefined;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return 'Please enter a valid email address';
    }

    return undefined;
  };

  const formatPhoneNumber = (phone: string): string => {
    const digits = phone.replace(/\D/g, '');

    if (digits.length === 10) {
      return `(${digits.substring(0, 3)}) ${digits.substring(
        3,
        6,
      )}-${digits.substring(6)}`;
    } else if (digits.length === 11 && digits[0] === '1') {
      return `+1 (${digits.substring(1, 4)}) ${digits.substring(
        4,
        7,
      )}-${digits.substring(7)}`;
    }

    return phone;
  };

  const handleAvatarChange = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
    });

    if (result.assets && result.assets[0].uri) {
      setUploadingAvatar(true);
      setAvatarUrl(result.assets[0].uri);

      try {
        const reference = storage().ref(`avatars/artists/${user?._id}`);
        await reference.putFile(result.assets[0].uri);
        const downloadUrl = await reference.getDownloadURL();
        setAvatarUrl(downloadUrl);
      } catch (uploadError) {
        console.error('Error uploading avatar:', uploadError);
        Toast.show({ type: 'error', text1: 'Failed to upload avatar' });
      } finally {
        setUploadingAvatar(false);
      }

      setTimeout(() => {
        setUploadingAvatar(false);
      }, 2000);
    }
  };

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    let processedValue = value;

    if (field === 'phoneNumber') {
      processedValue = formatPhoneNumber(value);
    }

    setProfileData(prev => ({ ...prev, [field]: processedValue }));

    if (error) setError(null);

    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      setError(null);

      const errors: ValidationErrors = {};
      errors.firstName = validateName(profileData.firstName);
      errors.lastName = validateName(profileData.lastName);
      errors.phoneNumber = validateUSAPhone(profileData.phoneNumber);
      errors.email = validateEmail(profileData.email);

      Object.keys(errors).forEach(key => {
        if (!errors[key as keyof ValidationErrors]) {
          delete errors[key as keyof ValidationErrors];
        }
      });

      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors);
        return;
      }

      let updateData: any = {
        firstName: profileData.firstName.trim(),
        lastName: profileData.lastName.trim(),
        email: profileData.email.trim(),
        phoneNumber: profileData.phoneNumber.replace(/\D/g, ''),
      };

      if (!updateData.email) {
        const { email, ...rest } = updateData;
        updateData = rest;
      }
      if (!updateData.phoneNumber) {
        const { phoneNumber, ...rest } = updateData;
        updateData = rest;
      }

      await updateMyProfile(updateData);

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Profile updated successfully',
      });
    } catch (err: any) {
      console.error('Failed to update profile:', err);
      setError(
        err.response?.data?.message ||
          err.message ||
          'Failed to update profile. Please try again.',
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignatureSubmit = async (_signatureDataUrl: string) => {
    try {
      const timestamp = Date.now();
      const fileName = `signature_${user?._id}_${timestamp}.png`;

      const reference = storage().ref(`signatures/artists/${fileName}`);
      await reference.putString(_signatureDataUrl, 'data_url');
      const downloadUrl = await reference.getDownloadURL();

      await updateMySignature({ signature_url: downloadUrl });

      setShowSignModal(false);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Signature updated successfully',
      });
    } catch (err) {
      console.error('Failed to update signature:', err);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to update signature',
      });
    }
  };

  const isFormValid = () => {
    return (
      Object.keys(validationErrors).length === 0 &&
      (profileData?.firstName || '').trim().length >= 2 &&
      (profileData?.lastName || '').trim().length >= 2
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Edit Your Profile</Text>
        <TouchableOpacity
          style={styles.signatureButton}
          onPress={() => setShowSignModal(true)}
        >
          <Edit3 size={16} color={colors.white} />
          <Text style={styles.signatureButtonText}>Update Signature</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarPlaceholderText}>
                  {(user?.firstName?.[0] || '') && (user?.lastName?.[0] || '')
                    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
                    : 'U'}
                </Text>
              </View>
            )}
            {uploadingAvatar && (
              <View style={styles.uploadingOverlay}>
                <ActivityIndicator size="small" color={colors.white} />
              </View>
            )}
          </View>
          <TouchableOpacity
            style={styles.cameraButton}
            onPress={handleAvatarChange}
          >
            <Camera size={20} color={colors.white} />
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              First Name <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[
                styles.input,
                validationErrors.firstName && styles.inputError,
              ]}
              value={profileData.firstName}
              onChangeText={value => handleInputChange('firstName', value)}
              placeholder="Enter your first name"
              placeholderTextColor={colors.textLight}
            />
            {validationErrors.firstName && (
              <Text style={styles.errorMessage}>
                {validationErrors.firstName}
              </Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Last Name <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[
                styles.input,
                validationErrors.lastName && styles.inputError,
              ]}
              value={profileData.lastName}
              onChangeText={value => handleInputChange('lastName', value)}
              placeholder="Enter your last name"
              placeholderTextColor={colors.textLight}
            />
            {validationErrors.lastName && (
              <Text style={styles.errorMessage}>
                {validationErrors.lastName}
              </Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={[
                styles.input,
                validationErrors.phoneNumber && styles.inputError,
              ]}
              value={profileData.phoneNumber}
              onChangeText={value => handleInputChange('phoneNumber', value)}
              placeholder="(123) 456-7890"
              placeholderTextColor={colors.textLight}
              keyboardType="phone-pad"
            />
            {validationErrors.phoneNumber && (
              <Text style={styles.errorMessage}>
                {validationErrors.phoneNumber}
              </Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[
                styles.input,
                validationErrors.email && styles.inputError,
              ]}
              value={profileData.email}
              onChangeText={value => handleInputChange('email', value)}
              placeholder="your.email@example.com"
              placeholderTextColor={colors.textLight}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {validationErrors.email && (
              <Text style={styles.errorMessage}>{validationErrors.email}</Text>
            )}
          </View>

          <TouchableOpacity
            style={[
              styles.saveButton,
              (!isFormValid() || isSaving) && styles.saveButtonDisabled,
            ]}
            onPress={handleSaveProfile}
            disabled={!isFormValid() || isSaving}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color={colors.white} />
            ) : (
              <Text style={styles.saveButtonText}>Save Changes</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      <SignatureModal
        visible={showSignModal}
        onClose={() => setShowSignModal(false)}
        onSubmit={handleSignatureSubmit}
        title="Update Your Signature"
        existingSignature={user?.signature_url}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
  },
  signatureButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 6,
  },
  signatureButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  errorContainer: {
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 32,
    position: 'relative',
  },
  avatarContainer: {
    position: 'relative',
    width: 120,
    height: 120,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarPlaceholderText: {
    color: colors.white,
    fontSize: 36,
    fontWeight: 'bold',
  },
  uploadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.white,
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  required: {
    color: colors.error,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.white,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorMessage: {
    fontSize: 12,
    color: colors.error,
  },
  saveButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EditProfileScreen;
