import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import ImageSlider from '../../components/ImageSlider';
import Login from './Login';
import Signup from './Signup';

type AuthPage = 'login' | 'signup';

const AuthScreen = () => {
  const [showAuthForms, setShowAuthForms] = useState(false);
  const [page, setPage] = useState<AuthPage>('login');

  const toggleMode = () => {
    setPage(page === 'login' ? 'signup' : 'login');
  };

  if (!showAuthForms) {
    return <ImageSlider onComplete={() => setShowAuthForms(true)} />;
  }

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {page === 'login' ? (
            <Login onToggleToSignup={toggleMode} />
          ) : (
            <Signup onToggleToLogin={toggleMode} />
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
});

export default AuthScreen;
