import { Edit } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  BusinessInfo,
  ChangePassword,
  HelpAndSupport,
  Logout,
  PaymentSvg,
  PrivacyPolicy,
} from '../../../assets/svg';
import ChangePasswordModal from '../../components/profile/ChangePasswordModal';
import EditBusinessInformationModal from '../../components/profile/EditBusinessInformationModal';
import UpdateServicesModal from '../../components/profile/UpdateServicesModal';
import useAuth from '../../hooks/useAuth';
import { colors } from '../../theme/colors';

interface ProfileScreenProps {
  navigation?: any;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [showEditBusinessInfo, setShowEditBusinessInfo] = useState(false);
  const [showUpdateServices, setShowUpdateServices] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  const profileMenuItems = [
    {
      icon: BusinessInfo,
      title: 'Business Information',
      onPress: () => navigation?.navigate('BusinessInformation'),
    },
    {
      icon: ChangePassword,
      title: 'Change Password',
      onPress: () => setShowChangePassword(true),
    },
    {
      icon: PaymentSvg,
      title: 'Payment & Subscriptions',
      onPress: () => navigation?.navigate('Payment'),
    },
    {
      icon: HelpAndSupport,
      title: 'Help & Support',
      onPress: () => navigation?.navigate('ContactSupport'),
    },
    {
      icon: PrivacyPolicy,
      title: 'Privacy Policy',
      onPress: () => navigation?.navigate('PrivacyPolicy'),
    },
    {
      icon: Logout,
      title: 'Log Out',
      onPress: () => logout(),
      variant: 'danger' as const,
    },
  ];

  const getInitials = (name: string) => {
    if (!name) return 'BN';
    const parts = name.trim().split(' ');
    if (parts.length === 1) {
      return parts[0].substring(0, 2).toUpperCase();
    }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleSection}>
          <Text style={styles.title}>Profile</Text>
          <Text style={styles.subtitle}>Update your profile settings here</Text>
        </View>

        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {getInitials(user?.businessName || 'Business Name')}
              </Text>
            </View>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.businessName}>
              {user?.businessName || 'Business Name'}
            </Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setShowEditBusinessInfo(true)}
            >
              <Edit size={16} color={colors.primary} />
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
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
              <View>
                <item.icon />
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
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  titleSection: {
    paddingTop: 16,
    paddingBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: 'RedditSans-Regular',
    fontWeight: '400',
    color: colors.black,
    letterSpacing: -0.12,
    lineHeight: 12,
    marginBottom: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 32,
    marginBottom: 16,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    alignContent: 'center',
    gap: 16,
  },
  avatarContainer: {
    width: 80,
    height: 80,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#8E2D8E1A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
  },
  userInfo: {
    flex: 1,
  },
  businessName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.black,
    marginBottom: 12,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#8E2D8E14',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  editButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  menu: {
    gap: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FBFBFB',
    borderRadius: 20,
    padding: 15,
    gap: 15,
  },
  menuItemDanger: {
    backgroundColor: '#fef2f2',
  },
  menuIconDanger: {
    backgroundColor: '#fee2e2',
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.black,
    flex: 1,
  },
  menuTitleDanger: {
    color: '#ef4444',
  },
});

export default ProfileScreen;
