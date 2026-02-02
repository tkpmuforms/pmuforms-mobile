import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { ChevronLeft } from 'lucide-react-native';
import { getServices, updateServices } from '../../services/artistServices';
import { colors } from '../../theme/colors';
import { refreshAuthUser } from '../../utils/authUtils';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

interface Service {
  _id: string;
  id: number;
  service: string;
}

interface ServicesSelectionScreenProps {
  navigation: any;
}

const ServicesSelectionScreen: React.FC<ServicesSelectionScreenProps> = ({
  navigation,
}) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const [availableServices, setAvailableServices] = useState<Service[]>([]);
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchServices();

    if (user?.services && Array.isArray(user.services)) {
      const userServiceIds = (user.services || [])
        .map((s: any) => s?._id)
        .filter(Boolean);
      setSelectedServices(userServiceIds);
    }
  }, [user]);

  const fetchServices = async () => {
    try {
      const response = await getServices();
      if (response?.data?.services) {
        setAvailableServices(response.data.services || []);
      }
    } catch (error) {
      console.warn(
        'Error fetching services:',
        (error as any)?.message || 'Unknown error',
      );
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to load services',
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleService = (serviceId: string) => {
    setSelectedServices(prev => {
      const isSelected = prev.some(service => service?._id === serviceId);
      if (isSelected) {
        return prev.filter(service => service?._id !== serviceId);
      }
      const foundService = (availableServices || []).find(
        service => service?._id === serviceId,
      );
      return foundService ? [...prev, foundService] : prev;
    });
  };

  const handleContinue = async () => {
    if ((selectedServices || []).length === 0) {
      Toast.show({
        type: 'error',
        text1: 'Required',
        text2: 'Please select at least one service',
      });
      return;
    }

    setSaving(true);
    try {
      const serviceIds = (selectedServices || [])
        .map(s => s?.id)
        .filter(Boolean);
      await updateServices({ services: serviceIds });

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Services saved successfully',
      });

      navigation.navigate('OnboardingPayment');

      // Refresh user data in background after navigation to avoid
      // race condition where RouteGuard unmounts OnboardingStack
      refreshAuthUser(dispatch).catch(() => {});
    } catch (error) {
      console.warn(
        'Error updating services:',
        (error as any)?.message || 'Unknown error',
      );
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to save services',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ChevronLeft size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={styles.progressFill} />
          </View>
          <Text style={styles.progressText}>Step 3 of 3</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerContent}>
          <Text style={styles.title}>Select Your Services</Text>
          <Text style={styles.subtitle}>
            Choose the services you offer. You can always update these later.
          </Text>
        </View>

        <View style={styles.servicesCard}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : (
            <View style={styles.servicesGrid}>
              {(availableServices || []).map(service => {
                const isSelected = (selectedServices || []).some(
                  s => s?._id === service?._id,
                );
                return (
                  <TouchableOpacity
                    key={service?._id || Math.random().toString()}
                    style={[
                      styles.serviceTag,
                      isSelected && styles.serviceTagSelected,
                    ]}
                    onPress={() => toggleService(service?._id)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.serviceText,
                        isSelected && styles.serviceTextSelected,
                      ]}
                    >
                      {service?.service || 'Unknown Service'}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {(selectedServices || []).length === 0 && !loading && (
            <View style={styles.warningBox}>
              <Text style={styles.warningText}>
                Please select at least one service
              </Text>
            </View>
          )}
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            Selected services will determine which forms are available to share
            with your clients
          </Text>
        </View>
      </ScrollView>

      {/* Footer Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, saving && styles.buttonDisabled]}
          onPress={handleContinue}
          disabled={saving || loading}
        >
          <Text style={styles.buttonText}>
            {saving ? 'Saving...' : 'Continue'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 8,
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 14,
  },
  progressContainer: {
    flex: 1,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.borderColor,
    borderRadius: 2,
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
    width: '66%',
  },
  progressText: {
    fontSize: 12,
    color: colors.subtitleColor,
    textAlign: 'center',
  },
  headerContent: {
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.subtitleColor,
    lineHeight: 24,
  },
  loadingContainer: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  servicesCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 5,
    borderWidth: 0.5,
    borderColor: colors.borderColor,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  serviceTag: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: colors.borderColor,
    borderRadius: 20,
    backgroundColor: colors.white,
  },
  serviceTagSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  serviceText: {
    fontSize: 13,
    color: colors.subtitleColor,
  },
  serviceTextSelected: {
    color: colors.white,
    fontWeight: '600',
  },
  warningBox: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
  },
  warningText: {
    color: '#dc2626',
    fontSize: 13,
    textAlign: 'center',
  },
  infoBox: {
    backgroundColor: '#f0f9ff',
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
    marginBottom: 16,
  },
  infoText: {
    fontSize: 13,
    color: colors.primary,
    lineHeight: 20,
  },
  footer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: colors.borderColor,
    backgroundColor: colors.white,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ServicesSelectionScreen;
