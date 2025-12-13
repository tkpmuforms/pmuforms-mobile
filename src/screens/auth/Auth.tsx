import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { SafeAreaView } from 'react-native-safe-area-context';
import useAuth from '../../hooks/useAuth';
// import {
//   GoogleLoginButton,
//   AppleLoginButton,
//   LogoSvg,
//   EyeIconSvg,
// } from '../../components/AuthSvgs';
import { createArtist } from '../../services/artistServices';
import { auth } from '../../config/firebase';
import { AppleIcon, EyeIcon, Chrome, Circle } from 'lucide-react-native';
import { Image } from 'react-native';
import ImageSlider from '../../components/ImageSlider';

type AuthPage = 'login' | 'signup';
type SignupStep = 'email' | 'password' | 'verification';

const AuthScreen = () => {
  const [showAuthForms, setShowAuthForms] = useState(false);
  const [page, setPage] = useState<AuthPage>('login');
  const [signupStep, setSignupStep] = useState<SignupStep>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { handleAuthSuccess } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please fill in all fields',
      });
      return;
    }

    setLoading(true);
    try {
      const userCredential = await auth().signInWithEmailAndPassword(
        email,
        password,
      );
      const user = userCredential.user;
      const userToken = await user.getIdToken();

      const res = await createArtist(userToken);

      handleAuthSuccess(res.data?.artist, res.data?.access_token ?? '');
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage =
        error?.message ||
        error?.response?.data?.error ||
        'Login failed! Try again later.';
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

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
    if (!password) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter a password',
      });
      return;
    }

    if (password !== confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Passwords do not match',
      });
      return;
    }

    if (!businessName) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter your business name',
      });
      return;
    }

    setLoading(true);
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );
      const user = userCredential.user;
      const userToken = await user.getIdToken();

      const res = await createArtist(userToken);

      if (res.data) {
        setSignupStep('verification');
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Account created! Please verify your email.',
        });
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      const errorMessage =
        error?.message ||
        error?.response?.data?.error ||
        'Registration failed! Try again later.';
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (signupStep === 'password') {
      setSignupStep('email');
    } else if (signupStep === 'verification') {
      setPage('login');
      setSignupStep('email');
    }
  };

  const toggleMode = () => {
    setPage(page === 'login' ? 'signup' : 'login');
    setSignupStep('email');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setBusinessName('');
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

  const renderLoginForm = () => (
    <View style={styles.formContainer}>
      <Text style={styles.title}>Hi, Welcome Back</Text>
      <Text style={styles.subtitle}>
        Enter your login details to access your account
      </Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email address"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, styles.passwordInput]}
            placeholder="Enter Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
          >
            <EyeIcon />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.forgotPassword}>
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>

      <View style={styles.dividerContainer}>
        <View style={styles.divider} />
        <Text style={styles.dividerText}>Or continue with</Text>
        <View style={styles.divider} />
      </View>

      <View style={styles.socialButtonsContainer}>
        <TouchableOpacity onPress={() => {}}>
          <Chrome width={48} height={48} color="#DB4437" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {}}>
          <AppleIcon width={48} height={48} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmailStep = () => (
    <View style={styles.formContainer}>
      <View style={styles.logoContainer}>
        <Circle width={80} height={80} color="#8e2d8e" />
      </View>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Sign up to get started</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email address"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleEmailSubmit}>
        <Text style={styles.buttonText}>Continue</Text>
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
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Business Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Business Name"
          value={businessName}
          onChangeText={setBusinessName}
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

      <TouchableOpacity style={styles.button} onPress={() => setPage('login')}>
        <Text style={styles.buttonText}>Go to Login</Text>
      </TouchableOpacity>
    </View>
  );

  const renderSignupContent = () => {
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

  return (
    <SafeAreaView style={styles.container}>
      {!showAuthForms ? (
        // Image Slider View - shown first
        <View style={styles.sliderContainer}>
          <ImageSlider onComplete={() => setShowAuthForms(true)} />
        </View>
      ) : (
        // Auth Forms View - shown after "Get Started" is clicked
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.content}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Image source={require('../../../assets/images/pmulog.png')} />
            {page === 'login' ? renderLoginForm() : renderSignupContent()}

            <TouchableOpacity style={styles.toggleButton} onPress={toggleMode}>
              <Text style={styles.toggleText}>
                {page === 'login'
                  ? "Don't have an account? "
                  : 'Already have an account? '}
                <Text style={styles.toggleTextBold}>
                  {page === 'login' ? 'Sign Up' : 'Sign In'}
                </Text>
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  sliderContainer: {
    flex: 1,
    position: 'relative',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
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
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    lineHeight: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#bcbbc133',
    borderRadius: 10,
    fontSize: 16,
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 48,
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
    top: 12,
    padding: 4,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#800080',
    fontSize: 14,
  },
  button: {
    width: '100%',
    padding: 12,
    backgroundColor: '#8e2d8e',
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  toggleButton: {
    marginTop: 24,
    alignItems: 'center',
  },
  toggleText: {
    fontSize: 14,
    color: '#666',
  },
  toggleTextBold: {
    color: '#8e2d8e',
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
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
});

export default AuthScreen;
