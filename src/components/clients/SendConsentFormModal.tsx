import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
} from 'react-native';
import { X } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import useAuth from '../../hooks/useAuth';
import PreviewAppointmentModal from './PreviewAppointmentModal';

interface SendConsentFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  clientName: string;
  clientId: string | undefined;
}

const SendConsentFormModal: React.FC<SendConsentFormModalProps> = ({
  visible,
  onClose,
  onSuccess,
  clientName,
  clientId,
}) => {
  const { user } = useAuth();
  const [appointmentDate, setAppointmentDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [showPreviewAppointment, setShowPreviewAppointment] = useState(false);

  const toggleService = (serviceId: string) => {
    setSelectedServices(prev =>
      prev.includes(serviceId)
        ? prev.filter(s => s !== serviceId)
        : [...prev, serviceId],
    );
  };

  const handleContinue = () => {
    if (appointmentDate && selectedServices.length > 0) {
      setShowPreviewAppointment(true);
    }
  };

  const getSelectedServiceNames = () => {
    return (
      user?.services
        ?.filter((service: any) => selectedServices.includes(service?.id))
        ?.map((service: any) => service?.service) || []
    );
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setAppointmentDate(selectedDate);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <>
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
                <Text style={styles.title}>Send Consent Form</Text>
                <Text style={styles.subtitle}>
                  Select the date and service to send the consent form to{' '}
                  {clientName}.
                </Text>
              </View>

              <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.formGroup}>
                  <Text style={styles.label}>
                    What's the date of the upcoming appointment(s)?*
                  </Text>
                  <TouchableOpacity
                    style={styles.dateInput}
                    onPress={() => setShowDatePicker(true)}
                  >
                    <Text style={styles.dateText}>
                      {formatDate(appointmentDate)}
                    </Text>
                  </TouchableOpacity>

                  {showDatePicker && (
                    <DateTimePicker
                      value={appointmentDate}
                      mode="date"
                      display="default"
                      onChange={onDateChange}
                      minimumDate={new Date()}
                    />
                  )}
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>
                    Select services for this client's upcoming appointment(s)*
                  </Text>
                  <View style={styles.servicesGrid}>
                    {user?.services?.map((service: any) => (
                      <TouchableOpacity
                        key={service?.id}
                        style={[
                          styles.serviceTag,
                          selectedServices.includes(service?.id) &&
                            styles.serviceTagSelected,
                        ]}
                        onPress={() => toggleService(service?.id)}
                        activeOpacity={0.7}
                      >
                        <Text
                          style={[
                            styles.serviceText,
                            selectedServices.includes(service?.id) &&
                              styles.serviceTextSelected,
                          ]}
                        >
                          {service?.service}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </ScrollView>

              <TouchableOpacity
                style={[
                  styles.continueButton,
                  selectedServices.length === 0 &&
                    styles.continueButtonDisabled,
                ]}
                onPress={handleContinue}
                disabled={selectedServices.length === 0}
              >
                <Text style={styles.continueButtonText}>Continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </Modal>

      {showPreviewAppointment && (
        <PreviewAppointmentModal
          visible={showPreviewAppointment}
          clientName={clientName}
          clientId={clientId || ''}
          appointmentDate={appointmentDate.toISOString()}
          selectedServices={getSelectedServiceNames()}
          selectedServiceIds={selectedServices}
          onClose={() => setShowPreviewAppointment(false)}
          onSuccess={onSuccess}
        />
      )}
    </>
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
    backgroundColor: '#fff',
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
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
  },
  scrollView: {
    maxHeight: 500,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 12,
  },
  dateInput: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    backgroundColor: '#f8fafc',
  },
  dateText: {
    fontSize: 14,
    color: '#000000',
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
    backgroundColor: '#8e2d8e',
    borderColor: '#8e2d8e',
  },
  serviceText: {
    fontSize: 14,
    color: '#64748b',
  },
  serviceTextSelected: {
    color: '#fff',
  },
  continueButton: {
    backgroundColor: 'linear-gradient(90deg, #8E2D8E 0%, #A654CD 100%)',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  continueButtonDisabled: {
    opacity: 0.5,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default SendConsentFormModal;
