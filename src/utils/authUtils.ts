import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import appleAuth from '@invertase/react-native-apple-authentication';
import Toast from 'react-native-toast-message';
import {
  createArtist,
  getAuthMe,
  sendEmailVerification,
} from '../services/artistServices';
import { setUser } from '../redux/auth';
import { Dispatch } from '@reduxjs/toolkit';
import { Artist, OnboardingStep } from '../types';

/**
 * Handles Google Sign-In authentication flow
 * @param onSuccess Callback function to handle successful authentication
 * @returns Promise<void>
 */
export const handleGoogleSignIn = async (
  onSuccess: (artist: any, accessToken: string) => void,
  setLoading?: (loading: boolean) => void,
) => {
  if (setLoading) setLoading(true);

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
      onSuccess(res.data?.artist, res.data?.access_token ?? '');
    }
  } catch (error: any) {
    console.error('Google Sign-In error:', error);
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: error?.message || 'Google Sign-In failed',
    });
    throw error;
  } finally {
    if (setLoading) setLoading(false);
  }
};

/**
 * Handles Apple Sign-In authentication flow
 * @param onSuccess Callback function to handle successful authentication
 * @returns Promise<void>
 */
export const handleAppleSignIn = async (
  onSuccess: (artist: any, accessToken: string) => void,
  setLoading?: (loading: boolean) => void,
) => {
  if (setLoading) setLoading(true);

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
    onSuccess(res.data?.artist, res.data?.access_token ?? '');
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
    throw error;
  } finally {
    if (setLoading) setLoading(false);
  }
};

/**
 * Handles email/password login
 * @param email User's email address
 * @param password User's password
 * @param onSuccess Callback function to handle successful authentication
 * @returns Promise<void>
 */
export const handleEmailPasswordLogin = async (
  email: string,
  password: string,
  onSuccess: (artist: any, accessToken: string) => void,
  setLoading?: (loading: boolean) => void,
) => {
  if (!email || !password) {
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: 'Please fill in all fields',
    });
    return;
  }

  if (setLoading) setLoading(true);

  try {
    const userCredential = await auth().signInWithEmailAndPassword(
      email,
      password,
    );
    const user = userCredential.user;
    const userToken = await user.getIdToken();

    const res = await createArtist(userToken);
    onSuccess(res.data?.artist, res.data?.access_token ?? '');
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
    throw error;
  } finally {
    if (setLoading) setLoading(false);
  }
};

/**
 * Handles user registration with email and password
 * @param email User's email address
 * @param password User's password
 * @returns Promise<void>
 */
export const handleEmailPasswordSignup = async (
  email: string,
  password: string,
  confirmPassword: string,
  setLoading?: (loading: boolean) => void,
) => {
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

  if (setLoading) setLoading(true);

  try {
    const userCredential = await auth().createUserWithEmailAndPassword(
      email,
      password,
    );
    const user = userCredential.user;
    await sendEmailVerification(user?.uid);

    Toast.show({
      type: 'success',
      text1: 'Success',
      text2: 'Verification link sent to your email!',
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: error?.message || 'Registration failed',
    });
    throw error;
  } finally {
    if (setLoading) setLoading(false);
  }
};

/**
 * Validates email format
 * @param email Email address to validate
 * @returns boolean indicating if email is valid
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates password strength (minimum 6 characters)
 * @param password Password to validate
 * @returns boolean indicating if password meets requirements
 */
export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

export const refreshAuthUser = async (dispatch: Dispatch): Promise<void> => {
  try {
    const response = await getAuthMe();
    if (response?.data?.user) {
      dispatch(setUser(response.data.user));
    }
  } catch (error) {
    console.error('Error refreshing auth user:', error);
    throw error;
  }
};

export const determineOnboardingStep = (artist: Artist): OnboardingStep => {
  if (artist.businessName === 'New Business') {
    return 'businessName';
  }

  if (!artist.services || artist.services.length === 0) {
    return 'services';
  }

  if (!artist.stripeSubscriptionActive && !artist.appStorePurchaseActive) {
    return 'payment';
  }

  return 'completed';
};
