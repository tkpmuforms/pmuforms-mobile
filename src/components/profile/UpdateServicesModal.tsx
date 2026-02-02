import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';
import { useDispatch } from 'react-redux';
import useAuth from '../../hooks/useAuth';
import { setUser } from '../../redux/auth';
import {
  getAuthMe,
  getServices,
  updateServices,
} from '../../services/artistServices';
import { Service } from '../../types';
import { Alert } from 'react-native';
import { colors } from '../../theme/colors';

interface UpdateServicesModalProps {
  visible: boolean;
  onClose: () => void;
  onGoBack: () => void;
  noGoBack?: boolean;
}

const UpdateServicesModal: React.FC<UpdateServicesModalProps> = ({
  visible,
  onClose,
  onGoBack,
  noGoBack = false,
}) => {
  const { user } = useAuth();
  const [selectedServices, setSelectedServices] = useState<Service[]>([
    ...(user?.services || []),
  ]);
  const [allServices, setAllServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const dispatch = useDispatch();

  useEffect(() => {
    if (visible) {
      fetchServices();
    }
  }, [visible]);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await getServices();

      const services: Service[] = (response?.data?.services || []).map(
        (service: Service) => ({
          _id: service?._id || '',
          id: service?.id || 0,
          service: service?.service || '',
        }),
      );

      setSelectedServices(prev => {
        const filtered = services.filter(service =>
          (prev || []).some(
            selected =>
              selected?._id === service?._id || selected?.id === service?.id,
          ),
        );

        return filtered;
      });

      setAllServices(services);
    } catch (error) {
      console.error('Error fetching services:', error);
      Alert.alert('Error', 'Failed to fetch services. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleService = (service: Service) => {
    setSelectedServices(prev => {
      const isSelected = (prev || []).some(s => s?._id === service?._id);
      if (isSelected) {
        return (prev || []).filter(s => s?._id !== service?._id);
      } else {
        return [...(prev || []), service];
      }
    });
  };

  const handleSave = async () => {
    if ((selectedServices || []).length === 0) {
      Alert.alert('Error', 'Please select at least one service');
      return;
    }

    const serviceIds = (selectedServices || []).map(s => s?.id).filter(Boolean);
    try {
      await updateServices({ services: serviceIds });
      await getAuthUser();
      Alert.alert('Success', 'Services updated successfully!');
      onGoBack();
    } catch (error) {
      console.error('Error updating services:', error);
      Alert.alert('Error', 'Failed to update services. Please try again.');
    }
  };

  const getAuthUser = async () => {
    try {
      const response = await getAuthMe();
      dispatch(setUser(response?.data?.user || null));
    } catch (error) {
      console.error('Error fetching auth user:', error);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={20} color={colors.subtitleColor} />
            </TouchableOpacity>

            <View style={styles.header}>
              <Text style={styles.title}>Update your Services</Text>
              <Text style={styles.subtitle}>
                Please select the services you'd like to offer.
              </Text>
            </View>

            <ScrollView
              style={styles.body}
              contentContainerStyle={styles.bodyContent}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.sectionTitle}>Select services</Text>
              {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={colors.primary} />
                </View>
              ) : (
                <View style={styles.servicesGrid}>
                  {allServices.map(service => {
                    const isSelected = selectedServices.some(
                      s => s._id === service._id,
                    );
                    return (
                      <TouchableOpacity
                        key={service._id}
                        style={[
                          styles.serviceTag,
                          isSelected && styles.serviceTagSelected,
                        ]}
                        onPress={() => toggleService(service)}
                        activeOpacity={0.7}
                      >
                        <Text
                          style={[
                            styles.serviceText,
                            isSelected && styles.serviceTextSelected,
                          ]}
                        >
                          {service.service}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </ScrollView>

            {selectedServices.length === 0 && (
              <View style={styles.warningBox}>
                <Text style={styles.warningText}>
                  ⚠️ Please select at least one service
                </Text>
              </View>
            )}

            <View style={styles.actions}>
              {!noGoBack && (
                <TouchableOpacity
                  style={styles.goBackButton}
                  onPress={onGoBack}
                >
                  <Text style={styles.goBackText}>Go Back</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[
                  styles.saveButton,
                  (loading || selectedServices.length === 0) &&
                    styles.buttonDisabled,
                  noGoBack && styles.saveButtonFull,
                ]}
                onPress={handleSave}
                disabled={loading || selectedServices.length === 0}
              >
                <Text style={styles.saveText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 32,
    maxHeight: '90%',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 8,
    borderRadius: 8,
    zIndex: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.black,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: colors.subtitleColor,
    textAlign: 'center',
  },
  body: {
    maxHeight: 400,
  },
  bodyContent: {
    paddingBottom: 16,
    flexGrow: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.black,
    marginBottom: 16,
  },
  loadingContainer: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  serviceTag: {
    paddingVertical: 8,
    paddingHorizontal: 16,
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
    fontSize: 14,
    color: colors.subtitleColor,
  },
  serviceTextSelected: {
    color: colors.white,
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
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  goBackButton: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.borderColor,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  goBackText: {
    color: colors.subtitleColor,
    fontSize: 14,
    fontWeight: '500',
  },
  saveButton: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonFull: {
    flex: 1,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  saveText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default UpdateServicesModal;
