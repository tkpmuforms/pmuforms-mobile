import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  FileText,
  CheckCircle,
  AlertTriangle,
  Edit3,
} from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import SignatureModal from '../../components/signature/SignatureModal';
import { signAppointment } from '../../services/artistServices';
import { colors } from '../../theme/colors';
import storage from '@react-native-firebase/storage';
import useAuth from '../../hooks/useAuth';

interface FormTemplate {
  appointmentId: string;
  title: string;
  status: string;
  formTemplateId?: string;
  formTemplate?: {
    title: string;
  };
}

interface ServiceDetail {
  id: number;
  service: string;
}

interface Appointment {
  id: string;
  date: string;
  serviceDetails: ServiceDetail[];
  allFormsCompleted: boolean;
  signed: boolean;
}

interface RouteParams {
  appointmentId: string;
  clientId: string;
  clientName: string;
  forms: FormTemplate[];
  appointments: Appointment[];
}

const SignatureScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useAuth();

  const { appointmentId, clientId, clientName, forms, appointments } =
    (route.params as RouteParams) || {};
  const [showSignModal, setShowSignModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [_signatureUrl, setSignatureUrl] = useState<string | null>(null);

  const currentAppointment: Appointment | undefined = appointments?.find(
    (appointment: Appointment) => appointment.id === appointmentId,
  );

  const appointmentForms =
    forms?.filter(
      (form: FormTemplate) => form.appointmentId === appointmentId,
    ) || [];

  const completedForms = appointmentForms.filter(
    (form: FormTemplate) =>
      form.status === 'complete' || form.status === 'completed',
  );

  const services = currentAppointment?.serviceDetails || [];

  const formatAppointmentTime = (dateString: string) => {
    if (!dateString) return 'Unknown date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleBackClick = () => {
    navigation.goBack();
  };

  const handleSignClick = () => {
    if (!canSign) {
      Toast.show({
        type: 'error',
        text1: 'Cannot Sign',
        text2: currentAppointment?.signed
          ? 'This appointment has already been signed'
          : 'Please complete all forms before signing',
      });
      return;
    }
    setShowSignModal(true);
  };

  const handleSignatureSubmit = async (signatureDataUrl: string) => {
    if (!appointmentId) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Appointment ID is missing',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const reference = storage().ref(
        `signatures/${user?._id}/${appointmentId}/${Date.now()}.png`,
      );
      const response = await fetch(signatureDataUrl);
      const blob = await response.blob();

      await reference.put(blob);
      const downloadUrl = await reference.getDownloadURL();

      await signAppointment(appointmentId, {
        signatureUrl: downloadUrl,
      });

      setSignatureUrl(downloadUrl);
      setShowSignModal(false);

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Signature submitted successfully',
      });

      if (forms && forms.length > 0) {
        (navigation as any).navigate('FilledFormsPreview', {
          appointmentId,
          templateId: forms[0]?.formTemplateId,
          clientId,
        });
      } else {
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error submitting signature:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to submit signature. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSign =
    currentAppointment?.allFormsCompleted && !currentAppointment?.signed;

  if (!currentAppointment) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <AlertTriangle size={48} color={colors.error} />
          <Text style={styles.errorTitle}>Appointment Not Found</Text>
          <Text style={styles.errorText}>
            Please check the appointment ID and try again.
          </Text>
          <TouchableOpacity style={styles.backButton} onPress={handleBackClick}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.card}>
          {/* Header Section */}
          <View style={styles.header}>
            <View style={styles.titleSection}>
              <Text style={styles.title}>Sign Appointment Forms</Text>
              <Text style={styles.subtitle}>Sign Client Appointment Forms</Text>
            </View>
          </View>

          {/* Sign Button */}
          <TouchableOpacity
            style={[styles.signButton, !canSign && styles.signButtonDisabled]}
            onPress={handleSignClick}
            disabled={!canSign || isSubmitting}
          >
            <Edit3
              size={20}
              color={canSign ? colors.white : colors.textLight}
            />
            <Text
              style={[
                styles.signButtonText,
                !canSign && styles.signButtonTextDisabled,
              ]}
            >
              {isSubmitting
                ? 'Submitting...'
                : currentAppointment?.signed
                ? 'Already Signed'
                : 'Sign Appointment Forms'}
            </Text>
          </TouchableOpacity>

          {/* Intro Section */}
          <View style={styles.introSection}>
            <Text style={styles.introText}>
              {currentAppointment?.allFormsCompleted
                ? `Thank you for completing all the forms for your appointment on ${formatAppointmentTime(
                    currentAppointment?.date,
                  )}! Now, all you need to do is sign!`
                : `Please complete all required forms before signing for your appointment on ${formatAppointmentTime(
                    currentAppointment?.date,
                  )}.`}
            </Text>
          </View>

          {/* Instruction Section */}
          <View style={styles.instructionSection}>
            <Text style={styles.instructionTitle}>Please read carefully</Text>
            <Text style={styles.instructionText}>
              By signing below,{' '}
              <Text style={styles.clientName}>{clientName || 'Client'}</Text>{' '}
              hereby agree that all the information in the forms completed for
              the appointment is true and accurate to the best of my knowledge.
            </Text>
          </View>

          {/* Forms List */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Forms{' '}
              {currentAppointment?.allFormsCompleted
                ? 'Completed'
                : `(${completedForms.length} of ${appointmentForms.length} completed)`}
            </Text>
            <View style={styles.list}>
              {appointmentForms.length > 0 ? (
                appointmentForms.map((form: FormTemplate, index: number) => (
                  <View key={index} style={styles.listItem}>
                    <FileText size={20} color={colors.primary} />
                    <Text style={styles.listItemText}>
                      {form.formTemplate?.title ||
                        form.title ||
                        `Form ${index + 1}`}
                    </Text>
                  </View>
                ))
              ) : (
                <View style={styles.listItem}>
                  <Text style={styles.listItemText}>No forms available</Text>
                </View>
              )}
            </View>
          </View>

          {/* Services List */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Services being done</Text>
            <View style={styles.list}>
              {services.length > 0 ? (
                services.map((service: ServiceDetail, index: number) => (
                  <View key={service.id || index} style={styles.listItem}>
                    <CheckCircle size={20} color={colors.success} />
                    <Text style={styles.listItemText}>{service.service}</Text>
                  </View>
                ))
              ) : (
                <View style={styles.listItem}>
                  <Text style={styles.listItemText}>No services specified</Text>
                </View>
              )}
            </View>
          </View>

          {/* Warning Box */}
          <View style={styles.warningBox}>
            <View style={styles.warningHeader}>
              <AlertTriangle size={20} color={colors.warning} />
              <Text style={styles.warningTitle}>Warning</Text>
            </View>
            <Text style={styles.warningText}>
              Once you sign the forms, neither you nor the artist can make
              changes. To change your answers after signing, you must create a
              new set of forms for the appointment.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Signature Modal */}
      {showSignModal && (
        <SignatureModal
          visible={showSignModal}
          onClose={() => setShowSignModal(false)}
          onSubmit={handleSignatureSubmit}
          title="Sign Appointment Forms"
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  card: {
    backgroundColor: colors.white,
    margin: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    marginBottom: 20,
  },
  titleSection: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textLight,
  },
  signButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 8,
  },
  signButtonDisabled: {
    backgroundColor: colors.border,
  },
  signButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  signButtonTextDisabled: {
    color: colors.textLight,
  },
  introSection: {
    backgroundColor: colors.backgroundLight,
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  introText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  instructionSection: {
    backgroundColor: '#FFF9E6',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
  },
  instructionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  clientName: {
    fontWeight: '700',
    color: colors.primary,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  list: {
    gap: 12,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  listItemText: {
    fontSize: 14,
    color: colors.text,
    flex: 1,
  },
  warningBox: {
    backgroundColor: '#FFF3F3',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFE0E0',
  },
  warningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.error,
  },
  warningText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  backButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SignatureScreen;
