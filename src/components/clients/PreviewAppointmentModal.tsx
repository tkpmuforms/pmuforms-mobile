import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Share,
} from 'react-native';
import { X, ChevronLeft, Calendar } from 'lucide-react-native';
import { formatAppointmentTime } from '../../utils/utils';
import {
  getMyServiceForms,
  bookAppointment,
} from '../../services/artistServices';
import { Config } from 'react-native-config';

interface PreviewAppointmentModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: (appointmentUrl?: string) => void;
  clientName: string;
  clientId: string;
  appointmentDate: string;
  selectedServices: string[];
  selectedServiceIds: string[];
}

interface FormData {
  id: number;
  name: string;
  title: string;
}

const PreviewAppointmentModal: React.FC<PreviewAppointmentModalProps> = ({
  visible,
  onClose,
  onSuccess,
  clientId,
  clientName,
  appointmentDate,
  selectedServices,
  selectedServiceIds,
}) => {
  const [formsToSend, setFormsToSend] = useState<FormData[]>([]);
  const [isLoadingForms, setIsLoadingForms] = useState(false);
  const [isBooking, setIsBooking] = useState(false);

  const fetchFormsForServices = async (serviceIds: string[]) => {
    if (!serviceIds || serviceIds.length === 0) return;

    setIsLoadingForms(true);

    try {
      const numericServiceIds = serviceIds
        .map(id => parseInt(id, 10))
        .filter(id => !isNaN(id));

      if (numericServiceIds.length === 0) {
        throw new Error('Invalid service IDs');
      }

      const response = await getMyServiceForms(numericServiceIds);
      setFormsToSend(response.data?.forms || []);
    } catch (error) {
      console.error('Error fetching forms:', error);
      setFormsToSend([]);
    } finally {
      setIsLoadingForms(false);
    }
  };

  useEffect(() => {
    if (visible && selectedServiceIds && selectedServiceIds.length > 0) {
      fetchFormsForServices(selectedServiceIds);
    }
  }, [visible, selectedServiceIds]);

  const getClientInitials = (name: string) => {
    return name
      ?.split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2);
  };

  const handleContinue = async () => {
    setIsBooking(true);

    try {
      const bookingData = {
        appointmentDate,
        customerId: clientId,
        services: selectedServiceIds
          .map(id => parseInt(id, 10))
          .filter(id => !isNaN(id)),
      };

      const response = await bookAppointment(bookingData);
      const appointmentId = response.data?.appointment?.id;

      if (appointmentId) {
        const baseUrl =
          Config.USER_WEBSITE_URL || 'https://business.pmuforms.com';
        const appointmentUrl = `${baseUrl}/#/appointment/${appointmentId}`;
        try {
          await Share.share({
            message: `Your appointment has been booked! View your forms here: ${appointmentUrl}`,
            url: appointmentUrl,
          });
        } catch (shareError) {
          console.error('Error sharing:', shareError);
        }

        Alert.alert('Success', 'Appointment booked successfully', [
          {
            text: 'OK',
            onPress: () => onSuccess(appointmentUrl),
          },
        ]);
      } else {
        console.error('No appointment ID returned from API');
        Alert.alert('Error', 'No appointment ID received');
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
      Alert.alert('Error', 'Error booking appointment. Please try again.');
    } finally {
      setIsBooking(false);
    }
  };

  const renderFormsSection = () => {
    if (isLoadingForms) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#8e2d8e" />
        </View>
      );
    }

    if (formsToSend.length === 0) {
      return (
        <View style={styles.noForms}>
          <Text style={styles.noFormsText}>
            No forms available for selected services
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.formsList}>
        {formsToSend.map(form => (
          <View key={form.id} style={styles.formItem}>
            <Text style={styles.formIcon}>📄</Text>
            <Text style={styles.formText}>{form?.title}</Text>
          </View>
        ))}
      </View>
    );
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
            <View style={styles.header}>
              <TouchableOpacity style={styles.backButton} onPress={onClose}>
                <ChevronLeft size={20} color="#000000" />
              </TouchableOpacity>
              <Text style={styles.title}>Preview Appointment</Text>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <X size={20} color="#64748b" />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.detailRow}>
                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>Client Name</Text>
                  <View style={styles.clientContent}>
                    <View style={styles.avatar}>
                      <Text style={styles.avatarText}>
                        {getClientInitials(clientName)}
                      </Text>
                    </View>
                    <Text style={styles.detailValue}>{clientName}</Text>
                  </View>
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>Appointment Date</Text>
                  <View style={styles.dateContent}>
                    <Calendar size={16} color="#8e2d8e" />
                    <Text style={styles.detailValue}>
                      {formatAppointmentTime(appointmentDate)}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Services Selected</Text>
                <View style={styles.servicesList}>
                  {selectedServices.map((service, index) => (
                    <View key={index} style={styles.serviceItem}>
                      <Text style={styles.bullet}>•</Text>
                      <Text style={styles.serviceText}>{service}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Forms to be sent</Text>
                {renderFormsSection()}
              </View>
            </ScrollView>

            <View style={styles.divider} />

            <TouchableOpacity
              style={[
                styles.continueButton,
                (formsToSend.length === 0 || isBooking) &&
                  styles.continueButtonDisabled,
              ]}
              onPress={handleContinue}
              disabled={formsToSend.length === 0 || isBooking}
            >
              {isBooking ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.continueButtonText}>Continue</Text>
              )}
            </TouchableOpacity>
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
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    flex: 1,
    textAlign: 'center',
  },
  closeButton: {
    padding: 8,
  },
  scrollView: {
    maxHeight: 500,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  detailRow: {
    gap: 16,
    marginBottom: 16,
  },
  detailSection: {
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 8,
    fontWeight: '500',
  },
  clientContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3e8ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8e2d8e',
  },
  dateContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailValue: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
  },
  servicesList: {
    gap: 8,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bullet: {
    fontSize: 16,
    color: '#8e2d8e',
  },
  serviceText: {
    fontSize: 14,
    color: '#374151',
  },
  loadingContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  noForms: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  noFormsText: {
    fontSize: 14,
    color: '#64748b',
  },
  formsList: {
    gap: 12,
  },
  formItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
  },
  formIcon: {
    fontSize: 20,
  },
  formText: {
    fontSize: 14,
    color: '#000000',
    flex: 1,
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

export default PreviewAppointmentModal;
