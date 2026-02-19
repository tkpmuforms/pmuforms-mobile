import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect } from 'react';
import {
  StatusBar,
  ActivityIndicator,
  View,
  StyleSheet,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import Toast from 'react-native-toast-message';
import { AuthProvider } from './src/context/AuthContext';
import { ThemeProvider } from './src/context/ThemeContext';
import useTheme from './src/hooks/useTheme';
import { store, persistor } from './src/redux/store';
import RouteGuard from './src/routes/RouteGuard';
import { setupGlobalFonts } from './src/config/setupGlobalFonts';
import { toastConfig } from './src/config/toastConfig';
import { colors } from './src/theme/colors';
import { StripeProvider } from '@stripe/stripe-react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Config } from 'react-native-config';

function AppContent() {
  const { colors: themeColors, isDark } = useTheme();

  useEffect(() => {
    setupGlobalFonts();
  }, []);

  GoogleSignin.configure({
    webClientId:
      '265429654619-lglm3v5quq9tnlv9mp64c6fipso6id0g.apps.googleusercontent.com',
    offlineAccess: true,
  });

  return (
    <PersistGate
      loading={
        <View
          style={[
            styles.loadingContainer,
            { backgroundColor: themeColors.background },
          ]}
        >
          <ActivityIndicator size="large" color={themeColors.primary} />
        </View>
      }
      persistor={persistor}
    >
      <StripeProvider
        publishableKey={Config.STRIPE_PUBLISHABLE_KEY || ''}
      >
        <SafeAreaProvider>
          <StatusBar
            barStyle={isDark ? 'light-content' : 'dark-content'}
            backgroundColor="transparent"
            translucent={true}
          />
          <NavigationContainer>
            <AuthProvider>
              <RouteGuard />
            </AuthProvider>
          </NavigationContainer>
          <Toast config={toastConfig} />
        </SafeAreaProvider>
      </StripeProvider>
    </PersistGate>
  );
}

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
});

export default App;
