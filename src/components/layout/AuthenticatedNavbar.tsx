import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { ChevronLeft, Menu } from 'lucide-react-native';
import { colors } from '../../theme/colors';

interface AuthenticatedNavbarProps {
  breadcrumbs?: string[];
  onMobileMenuToggle?: () => void;
  navigation?: any;
}

const AuthenticatedNavbar: React.FC<AuthenticatedNavbarProps> = ({
  breadcrumbs = [],
  // onMobileMenuToggle, // Removed - no sidebar, using bottom tabs
  navigation,
}) => {
  const handleBackClick = () => {
    if (navigation?.canGoBack()) {
      navigation.goBack();
    }
  };

  const lastBreadcrumb =
    breadcrumbs.length > 0 ? breadcrumbs[breadcrumbs.length - 1] : null;
  const showBackButton = breadcrumbs.length > 1 || navigation?.canGoBack();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View style={styles.navbarContainer}>
        <View style={styles.navbarLeft}>
          {/* Menu button removed - using bottom tabs instead */}
          {/* <TouchableOpacity
            style={styles.mobileMenuToggle}
            onPress={onMobileMenuToggle}
            activeOpacity={0.7}
          >
            <Menu size={24} color={colors.text} />
          </TouchableOpacity> */}

          <View style={styles.breadcrumbsContainer}>
            {showBackButton && (
              <TouchableOpacity
                style={styles.backButton}
                onPress={handleBackClick}
                activeOpacity={0.7}
              >
                <ChevronLeft size={20} color={colors.text} />
              </TouchableOpacity>
            )}
            {lastBreadcrumb && (
              <View style={styles.breadcrumbItem}>
                <Text style={styles.breadcrumbText} numberOfLines={1}>
                  {lastBreadcrumb}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    zIndex: 100,
  },
  navbarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    height: 56,
  },
  navbarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  mobileMenuToggle: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  breadcrumbsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  backButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
  },
  breadcrumbItem: {
    flex: 1,
  },
  breadcrumbText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    lineHeight: 28,
  },
});

export default AuthenticatedNavbar;
