import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CircleCheckBig } from 'lucide-react-native';
import { colors } from '../../theme/colors';

interface FormSentSuccessModalProps {
  visible: boolean;
  clientName: string;
  clientEmail?: string;
  onGoToDashboard: () => void;
  onViewAppointments: () => void;
}

const FormSentSuccessModal: React.FC<FormSentSuccessModalProps> = ({
  visible,
  clientName,
  clientEmail,
  onGoToDashboard,
  onViewAppointments,
}) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <SafeAreaView style={styles.container}>
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <View style={styles.iconContainer}>
              <View style={styles.iconCircle}>
                <CircleCheckBig size={48} color={colors.white} />
              </View>
            </View>

            <Text style={styles.title}>Form Sent Successfully!</Text>

            <Text style={styles.description}>
              We have sent <Text style={styles.highlight}>{clientName}</Text>{' '}
              the appointment forms to their email address. Check the Client
              Appointments tab for status updates. You'll be notified once the
              client completes it.
            </Text>

            <TouchableOpacity
              style={styles.dashboardButton}
              onPress={onGoToDashboard}
            >
              <Text style={styles.dashboardButtonText}>Go to Dashboard</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.viewAppointmentsButton}
              onPress={onViewAppointments}
            >
              <Text style={styles.viewAppointmentsText}>
                View Client's Appointment
              </Text>
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
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 48,
    paddingBottom: 48,
    paddingHorizontal: 24,
    alignItems: 'center',
    gap: 36,
  },
  iconContainer: {
    alignItems: 'center',
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#22C55E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.black,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: colors.subtitleColor,
    textAlign: 'center',
    lineHeight: 22,
  },
  highlight: {
    color: colors.primary,
    fontWeight: '600',
  },
  dashboardButton: {
    backgroundColor: '#A654CD',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
  },
  dashboardButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  viewAppointmentsButton: {
    paddingVertical: 8,
  },
  viewAppointmentsText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FormSentSuccessModal;
