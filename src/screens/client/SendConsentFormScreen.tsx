import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import useAuth from '../../hooks/useAuth';
import PreviewAppointmentModal from '../../components/clients/PreviewAppointmentModal';
import { RootStackParamList } from '../../types/navigation';

type SendConsentFormRouteProp = RouteProp<
  RootStackParamList,
  'SendConsentForm'
>;

const SendConsentFormScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<SendConsentFormRouteProp>();
  const { clientId, clientName } = route.params;

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
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleSuccess = () => {
    setShowPreviewAppointment(false);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={24} color="#000000" />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.title}>Send Consent Form</Text>
          <Text style={styles.subtitle}>
            Select the date and service to send the consent form to {clientName}
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formGroup}>
          <Text style={styles.label}>
            What's the date of the upcoming appointment(s)?
          </Text>
          <TouchableOpacity
            style={styles.dateInput}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateText}>{formatDate(appointmentDate)}</Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={appointmentDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onDateChange}
              minimumDate={new Date()}
            />
          )}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>
            Select services for this client's upcoming appointment(s)
          </Text>
          <Text style={styles.helperText}>
            {selectedServices.length} service(s) selected
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

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            selectedServices.length === 0 && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={selectedServices.length === 0}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>

      {showPreviewAppointment && (
        <PreviewAppointmentModal
          visible={showPreviewAppointment}
          clientName={clientName}
          clientId={clientId}
          appointmentDate={appointmentDate.toISOString()}
          selectedServices={getSelectedServiceNames()}
          selectedServiceIds={selectedServices}
          onClose={() => setShowPreviewAppointment(false)}
          onSuccess={handleSuccess}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    gap: 12,
  },
  backButton: {
    padding: 8,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
  },
  helperText: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 12,
  },
  dateInput: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  dateText: {
    fontSize: 16,
    color: '#000000',
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  serviceTag: {
    paddingVertical: 10,
    paddingHorizontal: 18,
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
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  continueButton: {
    backgroundColor: '#8e2d8e',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  continueButtonDisabled: {
    opacity: 0.5,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SendConsentFormScreen;
