import React, { useState } from 'react';
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
import { Service } from '../../types';

interface EditFormServicesProps {
  visible: boolean;
  onClose: () => void;
  allServices: Service[];
  selectedServices: number[];
  onUpdateServices: (selectedIds: number[]) => void;
  loading?: boolean;
}

const EditFormServices: React.FC<EditFormServicesProps> = ({
  visible,
  onClose,
  allServices,
  selectedServices,
  onUpdateServices,
  loading = false,
}) => {
  const [tempSelectedServices, setTempSelectedServices] =
    useState<number[]>(selectedServices);

  const handleServiceToggle = (serviceId: number) => {
    setTempSelectedServices(prev => {
      if (prev.includes(serviceId)) {
        return prev.filter(id => id !== serviceId);
      } else {
        return [...prev, serviceId];
      }
    });
  };

  const handleSave = () => {
    onUpdateServices(tempSelectedServices);
    onClose();
  };

  const handleCancel = () => {
    setTempSelectedServices(selectedServices);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleCancel}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <View style={styles.header}>
              <Text style={styles.title}>Edit Form Services</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleCancel}
              >
                <X size={24} color="#9ca3af" />
              </TouchableOpacity>
            </View>

            <Text style={styles.subtitle}>
              Please select the Permanent make up services you offer
            </Text>

            <ScrollView
              style={styles.content}
              contentContainerStyle={styles.contentContainer}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.sectionTitle}>Select Services</Text>

              {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#A858F0" />
                  <Text style={styles.loadingText}>Loading services...</Text>
                </View>
              ) : (
                <View style={styles.servicesGrid}>
                  {allServices.map(service => {
                    const serviceId = Number(service.id || service._id);
                    const isSelected = tempSelectedServices.includes(serviceId);

                    return (
                      <TouchableOpacity
                        key={serviceId}
                        style={[
                          styles.serviceTag,
                          isSelected && styles.serviceTagSelected,
                        ]}
                        onPress={() => handleServiceToggle(serviceId)}
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

            <View style={styles.footer}>
              <TouchableOpacity
                style={[
                  styles.continueButton,
                  loading && styles.buttonDisabled,
                ]}
                onPress={handleSave}
                disabled={loading}
              >
                <Text style={styles.continueButtonText}>Continue</Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '85%',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
    position: 'relative',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    right: 24,
    top: 24,
    padding: 4,
    borderRadius: 16,
  },
  subtitle: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 24,
    color: '#6b7280',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#374151',
    marginBottom: 16,
  },
  loadingContainer: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: '#6b7280',
    fontSize: 16,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  serviceTag: {
    backgroundColor: '#f1f5f9',
    color: '#475569',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  serviceTagSelected: {
    backgroundColor: '#f3e8ff',
    borderColor: '#A858F0',
  },
  serviceText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#475569',
  },
  serviceTextSelected: {
    color: '#A858F0',
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    backgroundColor: '#fafbfc',
  },
  continueButton: {
    width: '100%',
    backgroundColor: '#A858F0',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  continueButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EditFormServices;
