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
import { Check, ChevronLeft } from 'lucide-react-native';
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
      const userServiceIds = user.services.map((s: any) => s._id);
      setSelectedServices(userServiceIds);
    }
  }, [user]);

  const fetchServices = async () => {
    try {
      const response = await getServices();
      if (response?.data?.services) {
        setAvailableServices(response.data.services);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
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
    setSelectedServices(prev =>
      prev.some(service => service._id === serviceId)
        ? prev.filter(service => service._id !== serviceId)
        : [
            ...prev,
            availableServices.find(service => service._id === serviceId)!,
          ],
    );
  };

  const handleContinue = async () => {
    if (selectedServices.length === 0) {
      Toast.show({
        type: 'error',
        text1: 'Required',
        text2: 'Please select at least one service',
      });
      return;
    }

    setSaving(true);
    try {
      const serviceIds = selectedServices.map(s => s?.id);
      await updateServices({ services: serviceIds });

      // Refresh user data
      await refreshAuthUser(dispatch);

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Services saved successfully',
      });

      navigation.navigate('OnboardingPayment');
    } catch (error) {
      console.error('Error updating services:', error);
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
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ChevronLeft size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={styles.progressFill} />
          </View>
          <Text style={styles.progressText}>Step 2 of 3</Text>
        </View>

        {/* Header */}
        <View style={styles.headerContent}>
          <Text style={styles.title}>Select Your Services</Text>
          <Text style={styles.subtitle}>
            Choose the services you offer. You can always update these later.
          </Text>
        </View>

        {/* Services Grid */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <View style={styles.servicesGrid}>
            {availableServices.map(service => {
              const isSelected = selectedServices.some(
                s => s._id === service._id,
              );
              return (
                <TouchableOpacity
                  key={service._id}
                  style={[
                    styles.serviceCard,
                    isSelected && styles.serviceCardSelected,
                  ]}
                  onPress={() => toggleService(service._id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.serviceContent}>
                    <Text
                      style={[
                        styles.serviceName,
                        isSelected && styles.serviceNameSelected,
                      ]}
                    >
                      {service.service}
                    </Text>
                    {isSelected && (
                      <View style={styles.checkIcon}>
                        <Check size={18} color="#fff" />
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            💡 Selected services will determine which forms are available to
            share with your clients
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
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  progressContainer: {
    marginBottom: 32,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e2e8f0',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
    width: '66%',
  },
  progressText: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },
  headerContent: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    lineHeight: 24,
  },
  loadingContainer: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  servicesGrid: {
    gap: 12,
  },
  serviceCard: {
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#fff',
  },
  serviceCardSelected: {
    borderColor: colors.primary,
    backgroundColor: '#f3e8ff',
  },
  serviceContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    flex: 1,
  },
  serviceNameSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
  checkIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoBox: {
    backgroundColor: '#f0f9ff',
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
    marginBottom: 16,
  },
  infoText: {
    fontSize: 14,
    color: '#0369a1',
    lineHeight: 20,
  },
  footer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    backgroundColor: '#fff',
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
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ServicesSelectionScreen;
