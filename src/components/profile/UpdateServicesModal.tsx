import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { X } from 'lucide-react-native';
import { useDispatch } from 'react-redux';
import useAuth from '../../hooks/useAuth';
import { setUser } from '../../redux/auth';
import {
  getAuthMe,
  getServices,
  updateServices,
} from '../../services/artistServices';
import { Service } from '../../redux/types';
import { Alert } from 'react-native';

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
      const services: Service[] = response.data.services.map(
        (service: Service) => ({
          _id: service._id,
          id: service.id,
          service: service.service,
        })
      );
      setSelectedServices((prev) => {
        return services.filter((service) =>
          prev.some(
            (selected) =>
              selected._id === service._id || selected.id === service.id
          )
        );
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
    setSelectedServices((prev) => {
      const isSelected = prev.some((s) => s._id === service._id);
      if (isSelected) {
        return prev.filter((s) => s._id !== service._id);
      } else {
        return [...prev, service];
      }
    });
  };

  const handleSave = async () => {
    const serviceIds = selectedServices.map((s) => s.id);
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
      dispatch(setUser(response?.data?.user));
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
              <X size={20} color="#64748b" />
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
                  <ActivityIndicator size="large" color="#A858F0" />
                </View>
              ) : (
                <View style={styles.servicesGrid}>
                  {allServices.map((service) => {
                    const isSelected = selectedServices.some(
                      (s) => s._id === service._id
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
                  loading && styles.buttonDisabled,
                  noGoBack && styles.saveButtonFull,
                ]}
                onPress={handleSave}
                disabled={loading}
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
    justifyContent: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 20,
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
    color: '#1e293b',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
  body: {
    flex: 1,
  },
  bodyContent: {
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
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
    borderColor: '#e2e8f0',
    borderRadius: 20,
    backgroundColor: '#fff',
  },
  serviceTagSelected: {
    backgroundColor: '#A858F0',
    borderColor: '#A858F0',
  },
  serviceText: {
    fontSize: 14,
    color: '#64748b',
  },
  serviceTextSelected: {
    color: '#fff',
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
    borderColor: '#e2e8f0',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  goBackText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '500',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#A858F0',
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
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default UpdateServicesModal;
