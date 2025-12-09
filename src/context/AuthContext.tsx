import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import React, { createContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthenticated, setLoading, setUser } from '../redux/auth';
import { RootState } from '../redux/store';
import axiosInstance from '../utils/axiosSetup';
import { User } from '../types';

const TESTING_MODE = false;

export const setAuthHeader = (token?: string) => {
  if (token) {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common['Authorization'];
  }
};

const isValidToken = (token: string): boolean => {
  try {
    const decoded: any = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
  } catch {
    return false;
  }
};

const AuthContext = createContext({
  method: 'JWT',
  logout: () => {},
  handleAuthSuccess: (_user: User, _token: string) => {},
  handleAuthFail: () => {},
  user: {} as User,
  isAuthenticated: false,
  loading: false,
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading } = useSelector(
    (state: RootState) => state.auth,
  );

  const handleAuthSuccess = async (authUser: User, token: string) => {
    await AsyncStorage.setItem('accessToken', token);
    dispatch(setLoading(false));
    dispatch(setUser(authUser));
    dispatch(setAuthenticated(true));
    setAuthHeader(token);
  };

  const handleAuthFail = async () => {
    await AsyncStorage.removeItem('accessToken');
    dispatch(setLoading(false));
    dispatch(setAuthenticated(false));
    dispatch(setUser({}));
    setAuthHeader();
  };

  useEffect(() => {
    if (TESTING_MODE) {
      dispatch(setLoading(false));
      dispatch(setAuthenticated(true));
      dispatch(
        setUser({
          _id: 'test-user-123',
          email: 'test@example.com',
          businessName: 'Test Business',
        }),
      );
      return;
    }

    const initializeAuth = async () => {
      dispatch(setLoading(true));

      try {
        const token = await AsyncStorage.getItem('accessToken');

        if (token && isValidToken(token)) {
          setAuthHeader(token);
          dispatch(setAuthenticated(true));
          dispatch(setLoading(false));
        } else {
          await AsyncStorage.removeItem('accessToken');
          dispatch(setLoading(false));
          dispatch(setAuthenticated(false));
          dispatch(setUser({}));
          setAuthHeader();
        }
      } catch (error) {
        console.error('Error during auth initialization:', error);
        await AsyncStorage.removeItem('accessToken');
        dispatch(setLoading(false));
        dispatch(setAuthenticated(false));
        dispatch(setUser({}));
        setAuthHeader();
      }
    };

    initializeAuth();
  }, [dispatch]);

  const logout = async () => {
    if (TESTING_MODE) {
      return;
    }

    setAuthHeader();
    dispatch(setLoading(false));
    dispatch(setAuthenticated(false));
    dispatch(setUser({}));

    const businessUri = await AsyncStorage.getItem('businessUri');
    await AsyncStorage.clear();

    if (businessUri && businessUri !== 'null' && businessUri !== 'undefined') {
      await AsyncStorage.setItem('businessUri', businessUri);
    }
  };

  const value = {
    method: 'JWT',
    logout,
    handleAuthSuccess,
    handleAuthFail,
    user,
    isAuthenticated,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
