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
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import ScreenHeader from '../../components/layout/ScreenHeader';
import DateTimePicker from '@react-native-community/datetimepicker';
import useAuth from '../../hooks/useAuth';
import PreviewAppointmentModal from '../../components/clients/PreviewAppointmentModal';
import { RootStackParamList } from '../../types/navigation';
import { colors } from '../../theme/colors';

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
      <ScreenHeader
        title="Send Consent Form"
        onBack={() => navigation.goBack()}
      />

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
            <View>
              <DateTimePicker
                value={appointmentDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'inline' : 'default'}
                onChange={onDateChange}
                minimumDate={new Date()}
                themeVariant="light"
              />
              {Platform.OS === 'ios' && (
                <TouchableOpacity
                  style={styles.datePickerDone}
                  onPress={() => setShowDatePicker(false)}
                >
                  <Text style={styles.datePickerDoneText}>Done</Text>
                </TouchableOpacity>
              )}
            </View>
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
          onGoToDashboard={() => {
            setShowPreviewAppointment(false);
            navigation.navigate('Dashboard' as never);
          }}
          onViewAppointments={() => {
            setShowPreviewAppointment(false);
            (navigation as any).navigate('ClientAppointments', { clientId });
          }}
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
    padding: 16,
    paddingBottom: 32,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.black,
    marginBottom: 12,
  },
  helperText: {
    fontSize: 14,
    color: colors.subtitleColor,
    marginBottom: 12,
  },
  dateInput: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.borderColor,
    borderRadius: 12,
    backgroundColor: '#BCBBC133',
  },
  dateText: {
    fontSize: 16,
    color: colors.black,
  },
  datePickerDone: {
    alignSelf: 'flex-end',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginTop: 8,
  },
  datePickerDoneText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
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
    borderColor: colors.borderColor,
    borderRadius: 20,
    backgroundColor: '#BCBBC140',
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
  footer: {
    padding: 16,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  continueButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  continueButtonDisabled: {
    opacity: 0.5,
  },
  continueButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SendConsentFormScreen;
