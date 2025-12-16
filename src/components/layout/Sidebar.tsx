import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
  ScrollView,
} from 'react-native';
import {
  LayoutDashboard,
  Users,
  FileText,
  UserCircle,
  LogOut,
} from 'lucide-react-native';
import useAuth from '../../hooks/useAuth';
import { colors } from '../../theme/colors';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  navigation?: any;
}

interface MenuItem {
  name: string;
  icon: string;
  route: string;
  key: string;
}

const menuItems: MenuItem[] = [
  {
    name: 'Dashboard',
    icon: 'dashboard',
    route: 'Dashboard',
    key: 'dashboard',
  },
  { name: 'Clients', icon: 'clients', route: 'Clients', key: 'clients' },
  { name: 'Forms', icon: 'forms', route: 'Forms', key: 'forms' },
  { name: 'Profile', icon: 'profile', route: 'Profile', key: 'profile' },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, navigation }) => {
  const { user, logout } = useAuth();

  const handleItemClick = (route: string) => {
    navigation?.navigate(route);
    onClose();
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  const renderIcon = (iconName: string, isActive: boolean = false) => {
    const iconColor = isActive ? colors.primary : colors.textLight;
    const iconSize = 24;

    switch (iconName) {
      case 'dashboard':
        return <LayoutDashboard size={iconSize} color={iconColor} />;
      case 'clients':
        return <Users size={iconSize} color={iconColor} />;
      case 'forms':
        return <FileText size={iconSize} color={iconColor} />;
      case 'profile':
        return <UserCircle size={iconSize} color={iconColor} />;
      default:
        return <LayoutDashboard size={iconSize} color={iconColor} />;
    }
  };

  const getCurrentRoute = () => {
    return navigation?.getCurrentRoute?.()?.name || 'Dashboard';
  };

  const currentRoute = getCurrentRoute();

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.sidebar} onPress={e => e.stopPropagation()}>
          <View style={styles.sidebarContent}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.userSection}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {user?.businessName?.charAt(0)?.toUpperCase() || 'U'}
                  </Text>
                </View>
                <View style={styles.userInfo}>
                  <Text style={styles.userName} numberOfLines={1}>
                    {user?.businessName || 'User'}
                  </Text>
                  <Text style={styles.userEmail} numberOfLines={1}>
                    {user?.email || ''}
                  </Text>
                </View>
              </View>
            </View>

            {/* Navigation */}
            <ScrollView style={styles.nav} showsVerticalScrollIndicator={false}>
              <View style={styles.menu}>
                {menuItems.map(item => {
                  const isActive = currentRoute === item.route;
                  return (
                    <TouchableOpacity
                      key={item.key}
                      style={[
                        styles.menuItem,
                        isActive && styles.menuItemActive,
                      ]}
                      onPress={() => handleItemClick(item.route)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.menuIcon}>
                        {renderIcon(item.icon, isActive)}
                      </View>
                      <Text
                        style={[
                          styles.menuText,
                          isActive && styles.menuTextActive,
                        ]}
                      >
                        {item.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
              <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
                activeOpacity={0.7}
              >
                <View style={styles.logoutIcon}>
                  <LogOut size={24} color={colors.textLight} />
                </View>
                <Text style={styles.logoutText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
  },
  sidebar: {
    width: '80%',
    maxWidth: 300,
    height: '100%',
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  sidebarContent: {
    flex: 1,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 12,
    color: colors.textLight,
  },
  nav: {
    flex: 1,
    paddingVertical: 16,
  },
  menu: {
    paddingHorizontal: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 4,
  },
  menuItemActive: {
    backgroundColor: colors.primaryBackground,
  },
  menuIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textLight,
    flex: 1,
  },
  menuTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  footer: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  logoutIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textLight,
    flex: 1,
  },
});

export default Sidebar;
