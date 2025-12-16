import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AuthenticatedNavbar from './AuthenticatedNavbar';
import Sidebar from './Sidebar';

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleMobileMenuToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <AuthenticatedNavbar
        breadcrumbs={breadcrumbs}
        onMobileMenuToggle={handleMobileMenuToggle}
        navigation={navigation}
      />
      <View style={styles.content}>{children}</View>
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
        navigation={navigation}
      />
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
