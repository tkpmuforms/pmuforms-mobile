import { getApp } from '@react-native-firebase/app';
import messaging, {
  AuthorizationStatus,
  FirebaseMessagingTypes,
  getInitialNotification,
  getMessaging,
  getToken,
  onMessage,
  onNotificationOpenedApp,
  onTokenRefresh,
  requestPermission,
  setBackgroundMessageHandler,
} from '@react-native-firebase/messaging';
import { PermissionsAndroid, Platform } from 'react-native';

const getMsg = () => getMessaging(getApp());

async function _requestPermission(): Promise<boolean> {
  if (Platform.OS === 'ios') {
    const authStatus = await requestPermission(getMsg());
    return (
      authStatus === AuthorizationStatus.AUTHORIZED ||
      authStatus === AuthorizationStatus.PROVISIONAL
    );
  }

  if (Platform.OS === 'android' && Platform.Version >= 33) {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }

  return true;
}

async function getFCMToken(): Promise<string | null> {
  if (Platform.OS === 'ios') {
    try {
      await messaging().registerDeviceForRemoteMessages();
    } catch (e) {
      console.log('==== APNs REGISTRATION FAILED ====', e);
      return null;
    }
  }

  try {
    const token = await getToken(getMsg());
    return token;
  } catch (e) {
    console.log('==== FCM TOKEN ERROR ====', e);
    return null;
  }
}

function onForegroundMessage(
  handler: (message: FirebaseMessagingTypes.RemoteMessage) => void,
): () => void {
  return onMessage(getMsg(), handler);
}

function _onNotificationOpenedApp(
  handler: (message: FirebaseMessagingTypes.RemoteMessage) => void,
): () => void {
  return onNotificationOpenedApp(getMsg(), handler);
}

async function _getInitialNotification(): Promise<FirebaseMessagingTypes.RemoteMessage | null> {
  return getInitialNotification(getMsg());
}

function _setBackgroundMessageHandler(
  handler: (message: FirebaseMessagingTypes.RemoteMessage) => Promise<void>,
): void {
  setBackgroundMessageHandler(getMsg(), handler);
}

function _onTokenRefresh(handler: (token: string) => void): () => void {
  return onTokenRefresh(getMsg(), handler);
}

export const notificationService = {
  requestPermission: _requestPermission,
  getFCMToken,
  onForegroundMessage,
  onNotificationOpenedApp: _onNotificationOpenedApp,
  getInitialNotification: _getInitialNotification,
  setBackgroundMessageHandler: _setBackgroundMessageHandler,
  onTokenRefresh: _onTokenRefresh,
};
