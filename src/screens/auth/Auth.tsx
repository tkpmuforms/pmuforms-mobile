import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { EyeIcon } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import ImageSlider from '../../components/ImageSlider';
import useAuth from '../../hooks/useAuth';
import {
  createArtist,
  sendEmailVerification,
} from '../../services/artistServices';
import { colors } from '../../theme/colors';
import appleAuth from '@invertase/react-native-apple-authentication';

type AuthPage = 'login' | 'signup';
type SignupStep = 'email' | 'password' | 'verification';

const AuthScreen = () => {
  const [showAuthForms, setShowAuthForms] = useState(false);
  const [page, setPage] = useState<AuthPage>('login');
  const [signupStep, setSignupStep] = useState<SignupStep>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { handleAuthSuccess } = useAuth();

  const useGoogleSignIn = async () => {
    setLoading(true);
    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      const userInfo = await GoogleSignin.signIn();

      if (userInfo.data?.idToken) {
        const googleCredential = auth.GoogleAuthProvider.credential(
          userInfo.data.idToken,
        );
        const userCredential = await auth().signInWithCredential(
          googleCredential,
        );
        const userToken = await userCredential.user.getIdToken();

        const res = await createArtist(userToken);
        handleAuthSuccess(res.data?.artist, res.data?.access_token ?? '');
      }
    } catch (error: any) {
      console.error('Google Sign-In error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error?.message || 'Google Sign-In failed',
      });
    } finally {
      setLoading(false);
    }
  };
  const useAppleSignIn = async () => {
    setLoading(true);
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      if (!appleAuthRequestResponse.identityToken) {
        throw new Error('Apple Sign-In failed - no identity token returned');
      }

      const { identityToken, nonce } = appleAuthRequestResponse;
      const appleCredential = auth.AppleAuthProvider.credential(
        identityToken,
        nonce,
      );
      const userCredential = await auth().signInWithCredential(appleCredential);
      const userToken = await userCredential.user.getIdToken();

      const res = await createArtist(userToken);
      handleAuthSuccess(res.data?.artist, res.data?.access_token ?? '');
    } catch (error: any) {
      if (error.code === appleAuth.Error.CANCELED) {
        Toast.show({
          type: 'info',
          text1: 'Cancelled',
          text2: 'Apple Sign-In was cancelled',
        });
      } else {
        console.error('Apple Sign-In error:', error);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: error?.message || 'Apple Sign-In failed',
        });
      }
    } finally {
      setLoading(false);
    }
  };

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

    setLoading(true);
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );
      const user = userCredential.user;
      await sendEmailVerification(user?.uid).then(() => {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Verification link sent to your email!',
        });
      });
      setSignupStep('verification');
    } catch (error: any) {
      console.error('Registration error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error?.message || 'Registration failed',
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
      <View style={styles.logoContainer}>
        <Image
          source={require('../../../assets/images/pmulog.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.title}>Hi, Welcome Back</Text>
      <Text style={styles.subtitle}>
        Enter your login details to access your account
      </Text>

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

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, styles.passwordInput]}
            placeholder="Enter Password"
            placeholderTextColor="#94a3b8"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
          >
            <EyeIcon size={20} color="#64748b" />
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

      <TouchableOpacity style={styles.socialButton} onPress={useGoogleSignIn}>
        <Image
          source={require('../../../assets/images/flat-color-icons_google.png')}
          style={styles.socialIcon}
        />
        <Text style={styles.socialButtonText}>Sign in with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.socialButtonApple}
        onPress={useAppleSignIn}
      >
        <Image
          source={require('../../../assets/images/ant-design_apple-filled.png')}
          style={styles.socialIcon}
        />
        <Text style={styles.socialButtonTextApple}>Sign in with Apple</Text>
      </TouchableOpacity>
    </View>
  );

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

      <TouchableOpacity style={styles.socialButtonApple} onPress={() => {}}>
        <Image
          source={require('../../../assets/images/ant-design_apple-filled.png')}
          style={styles.socialIcon}
        />
        <Text style={styles.socialButtonTextApple}>Apple</Text>
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
            {page === 'login' ? renderLoginForm() : renderSignupContent()}

            <TouchableOpacity style={styles.toggleButton} onPress={toggleMode}>
              <Text style={styles.toggleText}>
                {page === 'login'
                  ? "Don't have an account? "
                  : 'Already have an account? '}
                <Text style={styles.toggleTextBold}>
                  {page === 'login' ? 'Create an account' : 'Login'}
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
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    fontSize: 14,
    color: '#1e293b',
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
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 24,
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

export default AuthScreen;
