import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  ActivityIndicator,
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
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import ScreenHeader from '../../components/layout/ScreenHeader';
import { createClient } from '../../services/artistServices';
import { colors } from '../../theme/colors';

const AddClientScreen: React.FC = () => {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  const [fieldErrors, setFieldErrors] = useState<Partial<typeof formData>>({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const errors: Partial<typeof formData> = {};
    if (!formData.firstName.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Enter a valid email address';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate() || loading) return;
    setLoading(true);
    try {
      const payload = {
        name: `${formData.firstName} ${formData.lastName}`,
        primaryPhone: formData.phone,
        cell_phone: formData.phone,
        email: formData.email,
      };
      const response = await createClient(payload);

      const customer = response?.data?.customer;
      const createdAt = customer?.createdAt
        ? new Date(customer.createdAt).getTime()
        : 0;
      const isExisting = Date.now() - createdAt > 10000; // older than 10s = pre-existing

      if (isExisting) {
        Toast.show({
          type: 'error',
          text1: 'Email already in use',
          text2: 'A client with this email already exists.',
        });
        return;
      }

      navigation.goBack();
    } catch (error: any) {
      const message =
        error?.message ||
        error?.error ||
        'Failed to add client. Please try again.';
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: message,
      });
    } finally {
      setLoading(false);
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
              title="Add New Client"
              subtitle="Please fill out the form to add a new client"
              onBack={() => navigation.goBack()}
            />

            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.formGroup}>
                <Text style={styles.label}>First Name *</Text>
                <TextInput
                  style={[
                    styles.input,
                    fieldErrors.firstName ? styles.inputError : null,
                  ]}
                  placeholder="First Name"
                  placeholderTextColor="#94a3b8"
                  value={formData.firstName}
                  onChangeText={value => handleInputChange('firstName', value)}
                  returnKeyType="next"
                />
                {!!fieldErrors.firstName && (
                  <Text style={styles.errorText}>{fieldErrors.firstName}</Text>
                )}
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Last Name *</Text>
                <TextInput
                  style={[
                    styles.input,
                    fieldErrors.lastName ? styles.inputError : null,
                  ]}
                  placeholder="Last Name"
                  placeholderTextColor="#94a3b8"
                  value={formData.lastName}
                  onChangeText={value => handleInputChange('lastName', value)}
                  returnKeyType="next"
                />
                {!!fieldErrors.lastName && (
                  <Text style={styles.errorText}>{fieldErrors.lastName}</Text>
                )}
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Email Address *</Text>
                <TextInput
                  style={[
                    styles.input,
                    fieldErrors.email ? styles.inputError : null,
                  ]}
                  placeholder="Email Address"
                  placeholderTextColor="#94a3b8"
                  value={formData.email}
                  onChangeText={value => handleInputChange('email', value)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  returnKeyType="next"
                />
                {!!fieldErrors.email && (
                  <Text style={styles.errorText}>{fieldErrors.email}</Text>
                )}
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Phone Number (Optional)</Text>
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

            <View style={styles.footer}>
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  loading && styles.submitButtonDisabled,
                ]}
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={colors.white} />
                ) : (
                  <Text style={styles.submitButtonText}>Add Client</Text>
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
    color: colors.black,
    marginBottom: 8,
  },
  input: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.borderColor,
    borderRadius: 12,
    fontSize: 16,
    color: colors.black,
    backgroundColor: '#BCBBC133',
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    marginTop: 4,
    fontSize: 12,
    color: colors.error,
  },
  footer: {
    padding: 16,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  submitButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#BCBBC133',
    opacity: 0.6,
  },
  submitButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddClientScreen;
