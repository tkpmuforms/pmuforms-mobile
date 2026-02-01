import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Toast from 'react-native-toast-message';

const baseURL = 'https://admin.pmuforms.com/';

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'content-type': 'application/json',
  },
});

export const getAccessToken = async (): Promise<string | null> => {
  return await AsyncStorage.getItem('accessToken');
};

export const isValidToken = (accessToken: string) => {
  if (!accessToken) {
    return false;
  }
  try {
    const decodedToken: { exp: number } = jwtDecode(accessToken);
    return decodedToken.exp * 1000 > new Date().getTime();
  } catch {
    return false;
  }
};

axiosInstance.interceptors.request.use(
  async req => {
    const accessToken = await getAccessToken();

    if (accessToken && isValidToken(accessToken)) {
      req.headers.Authorization = `Bearer ${accessToken}`;
    }

    return req;
  },
  error => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('accessToken');
    }

    const isNetworkError = !error.response && error.message === 'Network Error';
    if (isNetworkError) {
      Toast.show({
        type: 'error',
        text1: 'Connection lost',
        text2: 'Please check your network and try again',
      });
    }

    return Promise.reject(
      (error.response && error.response.data) || {
        message: isNetworkError
          ? 'No internet connection'
          : 'Something went wrong!',
        error,
      },
    );
  },
);

export default axiosInstance;
