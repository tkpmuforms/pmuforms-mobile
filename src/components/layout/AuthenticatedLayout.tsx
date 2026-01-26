import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AuthenticatedNavbar from './AuthenticatedNavbar';

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
  breadcrumbs?: string[];
  navigation?: any;
}

const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({
  children,
  breadcrumbs,
  navigation,
}) => {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* <AuthenticatedNavbar breadcrumbs={breadcrumbs} navigation={navigation} /> */}
      <View style={styles.content}>{children}</View>
    </SafeAreaView>
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
});

export default AuthenticatedLayout;
