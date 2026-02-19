import { EyeIcon } from 'lucide-react-native';
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
import useAuth from '../../hooks/useAuth';
import { colors } from '../../theme/colors';
import {
  handleAppleSignIn,
  handleEmailPasswordLogin,
  handleGoogleSignIn,
} from '../../utils/authUtils';

interface LoginProps {
  onToggleToSignup: () => void;
}

const Login: React.FC<LoginProps> = ({ onToggleToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { handleAuthSuccess } = useAuth();

  const handleLogin = async () => {
    await handleEmailPasswordLogin(
      email,
      password,
      handleAuthSuccess,
      setLoading,
    );
  };

  const useGoogleSignIn = async () => {
    await handleGoogleSignIn(handleAuthSuccess, setLoading);
  };

  const useAppleSignIn = async () => {
    await handleAppleSignIn(handleAuthSuccess, setLoading);
  };

  return (
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
            <EyeIcon size={20} color={colors.subtitleColor} />
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
          <ActivityIndicator color={colors.white} />
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

      <TouchableOpacity style={styles.toggleButton} onPress={onToggleToSignup}>
        <Text style={styles.toggleText}>
          Don't have an account?{' '}
          <Text style={styles.toggleTextBold}>Create an account</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    width: '100%',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    width: 80,
    height: 80,
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
    color: colors.subtitleColor,
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
    borderColor: colors.borderColor,
    backgroundColor: '#BCBBC133',
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
    color: colors.white,
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
    color: colors.subtitleColor,
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
    color: colors.white,
  },
  socialIcon: {
    width: 24,
    height: 24,
  },
});

export default Login;
