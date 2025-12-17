import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Building2,
  Edit,
  FileText,
  HelpCircle,
  Key,
  LogOut,
} from 'lucide-react-native';
import useAuth from '../../hooks/useAuth';
import { colors } from '../../theme/colors';
import ChangePasswordModal from '../../components/profile/ChangePasswordModal';
import EditBusinessInformationModal from '../../components/profile/EditBusinessInformationModal';
import UpdateServicesModal from '../../components/profile/UpdateServicesModal';

interface ProfileScreenProps {
  navigation?: any;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [showEditBusinessInfo, setShowEditBusinessInfo] = useState(false);
  const [showUpdateServices, setShowUpdateServices] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2);
  };

  const getAvatarUrl = () => {
    if (user?.avatarUrl) return user.avatarUrl;
    const name = user?.businessName || 'User';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name,
    )}&background=${colors.primary.replace('#', '')}&color=fff&size=120`;
  };

  const profileMenuItems = [
    {
      icon: Building2,
      title: 'Business Information',
      onPress: () => setShowEditBusinessInfo(true),
    },
    {
      icon: Key,
      title: 'Change Password',
      onPress: () => setShowChangePassword(true),
    },
    {
      icon: FileText,
      title: 'Payment & Subscriptions',
      onPress: () => navigation?.navigate('Payment'),
    },
    {
      icon: HelpCircle,
      title: 'Help & Support',
      onPress: () => navigation?.navigate('Support'),
    },
    {
      icon: FileText,
      title: 'Privacy Policy',
      onPress: () => navigation?.navigate('PrivacyPolicy'),
    },
    {
      icon: LogOut,
      title: 'Log Out',
      onPress: () => logout(),
      variant: 'danger' as const,
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: getAvatarUrl() }} style={styles.avatar} />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.businessName}>
              {user?.businessName || 'Business Name'}
            </Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setShowEditBusinessInfo(true)}
            >
              <Edit size={20} color="#fff" />
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menu}>
          {profileMenuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.menuItem,
                item.variant === 'danger' && styles.menuItemDanger,
              ]}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.menuIcon,
                  item.variant === 'danger' && styles.menuIconDanger,
                ]}
              >
                <item.icon
                  size={24}
                  color={item.variant === 'danger' ? '#ef4444' : '#64748b'}
                />
              </View>
              <Text
                style={[
                  styles.menuTitle,
                  item.variant === 'danger' && styles.menuTitleDanger,
                ]}
              >
                {item.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Modals */}
      {showEditBusinessInfo && (
        <EditBusinessInformationModal
          visible={showEditBusinessInfo}
          onClose={() => setShowEditBusinessInfo(false)}
          onSave={() => setShowEditBusinessInfo(false)}
        />
      )}

      {showUpdateServices && (
        <UpdateServicesModal
          visible={showUpdateServices}
          onClose={() => setShowUpdateServices(false)}
          onGoBack={() => setShowUpdateServices(false)}
        />
      )}

      {showChangePassword && (
        <ChangePasswordModal
          visible={showChangePassword}
          onClose={() => setShowChangePassword(false)}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 48,
  },
  avatarContainer: {
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primary,
  },
  userInfo: {
    alignItems: 'center',
  },
  businessName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 16,
    textAlign: 'center',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  menu: {
    gap: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 20,
    padding: 20,
    gap: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  menuItemDanger: {
    backgroundColor: '#fef2f2',
  },
  menuIcon: {
    width: 56,
    height: 56,
    backgroundColor: '#f1f5f9',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIconDanger: {
    backgroundColor: '#fee2e2',
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    flex: 1,
  },
  menuTitleDanger: {
    color: '#ef4444',
  },
});

export default ProfileScreen;
