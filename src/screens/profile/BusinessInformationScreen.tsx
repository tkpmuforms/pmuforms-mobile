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
import { Edit } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../theme/colors';
import useAuth from '../../hooks/useAuth';
import { Service } from '../../types';
import UpdateServicesModal from '../../components/profile/UpdateServicesModal';
import ScreenHeader from '../../components/layout/ScreenHeader';

const BusinessInformationScreen: React.FC = () => {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [showUpdateServices, setShowUpdateServices] = useState(false);

  const registeredServices = (user?.services || []) as Service[];

  const handleEditBusinessName = () => {
    navigation.navigate('EditBusinessInformation');
  };

  const handleEditServices = () => {
    setShowUpdateServices(true);
  };

  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    return 'Logo';
  };

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      <ScreenHeader
        title="Business Information"
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.section}>
          <View style={styles.sectionContent}>
            <Text style={styles.label}>Business Name</Text>
            <View style={styles.businessNameContainer}>
              <View style={styles.avatarContainer}>
                {user?.avatarUrl ? (
                  <Image
                    source={{ uri: user.avatarUrl }}
                    style={styles.avatar}
                  />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <Text style={styles.avatarText}>{getInitials()}</Text>
                  </View>
                )}
              </View>
              <Text style={styles.businessName}>
                {user?.businessName || 'N/A'}
              </Text>
            </View>

            <Text style={styles.label}>Email</Text>
            <Text style={styles.businessInfo}>{user?.email || 'N/A'}</Text>

            <Text style={styles.label}>Phone Number</Text>
            <Text style={styles.businessInfo}>
              {user?.businessPhoneNumber || 'N/A'}
            </Text>

            <Text style={styles.label}>Address</Text>
            <Text style={styles.businessInfo}>
              {user?.businessAddress || 'N/A'}
            </Text>

            <Text style={styles.label}>Website</Text>
            <Text style={styles.businessInfo}>{user?.website || 'N/A'}</Text>
          </View>

          <TouchableOpacity
            style={styles.editButton}
            onPress={handleEditBusinessName}
          >
            <Edit size={16} color={colors.white} />
            <Text style={styles.editButtonText}>Edit Business Info</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionContent}>
            <Text style={styles.label}>Registered Services</Text>
            <View style={styles.servicesList}>
              {registeredServices.length > 0 ? (
                registeredServices.map((service, index) => (
                  <View
                    key={`${service._id || service.id}-${index}`}
                    style={styles.serviceItem}
                  >
                    <View style={styles.serviceBullet} />
                    <Text style={styles.serviceText}>{service.service}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.noServicesText}>
                  No services registered
                </Text>
              )}
            </View>
          </View>

          <TouchableOpacity
            style={styles.editButton}
            onPress={handleEditServices}
          >
            <Edit size={16} color={colors.white} />
            <Text style={styles.editButtonText}>Edit Services</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <UpdateServicesModal
        visible={showUpdateServices}
        onClose={() => setShowUpdateServices(false)}
        onGoBack={() => setShowUpdateServices(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 15,
  },
  section: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 1,
    marginBottom: 16,
  },
  sectionContent: {
    marginBottom: 16,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textLight,
    marginTop: 16,
    marginBottom: 8,
  },
  businessNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  avatarContainer: {
    width: 60,
    height: 60,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(142, 45, 142, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
  },
  businessName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  businessInfo: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 8,
  },
  servicesList: {
    gap: 8,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  serviceBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  serviceText: {
    fontSize: 16,
    color: colors.text,
  },
  noServicesText: {
    fontSize: 14,
    color: colors.textLight,
    fontStyle: 'italic',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  editButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default BusinessInformationScreen;
