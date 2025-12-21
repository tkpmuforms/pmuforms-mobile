import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect } from 'react';
import {
  StatusBar,
  useColorScheme,
  ActivityIndicator,
  View,
  StyleSheet,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import Toast from 'react-native-toast-message';
import { AuthProvider } from './src/context/AuthContext';
import { store, persistor } from './src/redux/store';
import RouteGuard from './src/routes/RouteGuard';
import { setupGlobalFonts } from './src/config/setupGlobalFonts';
import { toastConfig } from './src/config/toastConfig';
import { colors } from './src/theme/colors';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    setupGlobalFonts();
  }, []);

  return (
    <Provider store={store}>
      <PersistGate
        loading={
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        }
        persistor={persistor}
      >
        <SafeAreaProvider>
          <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
          <NavigationContainer>
            <AuthProvider>
              <RouteGuard />
            </AuthProvider>
          </NavigationContainer>
          <Toast config={toastConfig} />
        </SafeAreaProvider>
      </PersistGate>
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
