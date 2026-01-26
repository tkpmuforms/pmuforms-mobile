import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import useAuth from '../../hooks/useAuth';
import { colors } from '../../theme/colors';
import {
  handleAppleSignIn,
  handleEmailPasswordSignup,
  handleGoogleSignIn,
} from '../../utils/authUtils';

type SignupStep = 'email' | 'password' | 'verification';

interface SignupProps {
  onToggleToLogin: () => void;
}

const Signup: React.FC<SignupProps> = ({ onToggleToLogin }) => {
  const [signupStep, setSignupStep] = useState<SignupStep>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { handleAuthSuccess } = useAuth();

  const handleEmailSubmit = () => {
    if (!email) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter your email',
      });
      return;
    }
    setSignupStep('password');
  };

  const handlePasswordSubmit = async () => {
    try {
      await handleEmailPasswordSignup(
        email,
        password,
        confirmPassword,
        setLoading,
      );
      setSignupStep('verification');
    } catch (error) {
      // Error is already handled in authUtils
    }
  };

  const handleBack = () => {
    if (signupStep === 'password') {
      setSignupStep('email');
    } else if (signupStep === 'verification') {
      onToggleToLogin();
      setSignupStep('email');
    }
  };

  const getProgressPercentage = (): number => {
    switch (signupStep) {
      case 'email':
        return 0;
      case 'password':
        return 40;
      case 'verification':
        return 80;
      default:
        return 0;
    }
  };

  const useGoogleSignIn = async () => {
    await handleGoogleSignIn(handleAuthSuccess, setLoading);
  };

  const useAppleSignIn = async () => {
    await handleAppleSignIn(handleAuthSuccess, setLoading);
  };

  const renderEmailStep = () => (
    <View style={styles.formContainer}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../../../assets/images/pmulog.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.title}>Let's Get You Started</Text>
      <Text style={styles.subtitle}>Create an account to continue</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email address"
          placeholderTextColor="#94a3b8"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleEmailSubmit}>
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>

      <View style={styles.dividerContainer}>
        <View style={styles.divider} />
        <Text style={styles.dividerText}>Or continue with</Text>
        <View style={styles.divider} />
      </View>

      <TouchableOpacity style={styles.socialButton} onPress={useGoogleSignIn}>
        <Image
          source={require('../../../assets/images/flat-color-icons_google.png')}
          style={styles.socialIcon}
        />
        <Text style={styles.socialButtonText}>Google</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.socialButtonApple}
        onPress={useAppleSignIn}
      >
        <Image
          source={require('../../../assets/images/ant-design_apple-filled.png')}
          style={styles.socialIcon}
        />
        <Text style={styles.socialButtonTextApple}>Apple</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.toggleButton} onPress={onToggleToLogin}>
        <Text style={styles.toggleText}>
          Already have an account?{' '}
          <Text style={styles.toggleTextBold}>Login</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderPasswordStep = () => (
    <View style={styles.formContainer}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          {/* <Ionicons name="arrow-back" size={24} color="#8e2d8e" /> */}
        </TouchableOpacity>
        <View style={styles.progressBar}>
          <View style={styles.progressLine}>
            <View
              style={[
                styles.progressFill,
                { width: `${getProgressPercentage()}%` },
              ]}
            />
          </View>
        </View>
      </View>

      <Text style={styles.title}>Create Password</Text>
      <Text style={styles.subtitle}>
        Set a secure password for your account
      </Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Password"
          placeholderTextColor="#94a3b8"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Confirm Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#94a3b8"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={handlePasswordSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Create Account</Text>
        )}
      </TouchableOpacity>
    </View>
  );

  const renderVerificationStep = () => (
    <View style={styles.formContainer}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          {/* <Ionicons name="arrow-back" size={24} color="#8e2d8e" /> */}
        </TouchableOpacity>
        <View style={styles.progressBar}>
          <View style={styles.progressLine}>
            <View
              style={[
                styles.progressFill,
                { width: `${getProgressPercentage()}%` },
              ]}
            />
          </View>
        </View>
      </View>

      <Text style={styles.title}>Verify Your Email</Text>
      <Text style={styles.subtitle}>
        We've sent a verification link to {email}. Please check your inbox.
      </Text>

      <TouchableOpacity style={styles.button} onPress={onToggleToLogin}>
        <Text style={styles.buttonText}>Go to Login</Text>
      </TouchableOpacity>
    </View>
  );

  const renderContent = () => {
    switch (signupStep) {
      case 'email':
        return renderEmailStep();
      case 'password':
        return renderPasswordStep();
      case 'verification':
        return renderVerificationStep();
      default:
        return renderEmailStep();
    }
  };

  return renderContent();
};

const styles = StyleSheet.create({
  formContainer: {
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 12,
  },
  backButton: {
    padding: 4,
  },
  progressBar: {
    flex: 1,
  },
  progressLine: {
    height: 8,
    backgroundColor: '#eee',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#8e2d8e',
    borderRadius: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 8,
    color: '#1e293b',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 32,
    lineHeight: 20,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#BCBBC133',
    borderRadius: 8,
    fontSize: 14,
    color: '#1e293b',
  },
  button: {
    width: '100%',
    padding: 16,
    backgroundColor: colors.primary,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  toggleButton: {
    marginTop: 16,
    alignItems: 'center',
    paddingVertical: 8,
  },
  toggleText: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },
  toggleTextBold: {
    color: colors.primary,
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  dividerText: {
    fontSize: 14,
    color: '#666',
    marginHorizontal: 12,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    width: 80,
    height: 80,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: 14,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    marginBottom: 12,
    gap: 12,
  },
  socialButtonApple: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: 14,
    backgroundColor: '#000',
    borderRadius: 8,
    marginBottom: 12,
    gap: 12,
  },
  socialButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  socialButtonTextApple: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  socialIcon: {
    width: 24,
    height: 24,
  },
});

export default Signup;
