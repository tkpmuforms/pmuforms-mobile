import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Edit3, FileText } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import FilledFormCard from '../../components/clients/FilledFormCard';
import ScreenHeader from '../../components/layout/ScreenHeader';
import {
  getAppointmentsForCustomer,
  getCustomerById,
  getFilledFormsByAppointment,
} from '../../services/artistServices';
import { FilledForm } from '../../types';
import { colors } from '../../theme/colors';
import { SignatureIcon } from '../../../assets/svg';

interface RouteParams {
  clientId: string;
  appointmentId: string;
  clientName?: string;
  appointments?: any[];
}

const ClientAppointmentFormsScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {
    clientId,
    appointmentId,
    clientName: paramClientName,
    appointments: paramAppointments,
  } = (route.params as RouteParams) || {};

  const [forms, setForms] = useState<FilledForm[]>([]);
  const [loading, setLoading] = useState(false);
  const [clientName, setClientName] = useState<string>(paramClientName || '');
  const [appointments, setAppointments] = useState<any[]>(
    paramAppointments || [],
  );

  useEffect(() => {
    const fetchData = async () => {
      if (!appointmentId || !clientId) return;

      setLoading(true);
      try {
        if (!clientName) {
          const clientResponse = await getCustomerById(clientId);
          const fetchedClientName =
            clientResponse?.data?.customer?.name || 'Client';
          setClientName(fetchedClientName);
        }

        if (!paramAppointments || paramAppointments.length === 0) {
          const appointmentsResponse = await getAppointmentsForCustomer(
            clientId,
          );
          setAppointments(appointmentsResponse?.data?.appointments || []);
        }

        const formsResponse = await getFilledFormsByAppointment(appointmentId);
        setForms(formsResponse.data?.filledForms || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setForms([]);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to load forms',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [appointmentId, clientId]);

  const isAllFormsCompleted = forms.every(
    form => form.status === 'complete' || form.status === 'completed',
  );

  const onViewForm = (formTemplateId: string) => {
    (navigation as any).navigate('FilledFormsPreview', {
      appointmentId,
      templateId: formTemplateId,
      clientId,
    });
  };

  const onSignForms = () => {
    (navigation as any).navigate('AppointmentSignature', {
      appointmentId,
      clientId,
      clientName,
      forms,
      appointments,
    });
  };

  const renderHeader = () => (
    <ScreenHeader
      title={`${clientName}'s Forms`}
      subtitle={`${forms.length} ${forms.length === 1 ? 'Form' : 'Forms'}`}
      onBack={() => navigation.goBack()}
    />
  );

  const renderSignButton = () => {
    if (forms.length === 0) return null;

    const canSign = forms.length > 0 && isAllFormsCompleted;

    return (
      <View style={styles.signButtonContainer}>
        <TouchableOpacity
          style={[styles.signButton, !canSign && styles.signButtonDisabled]}
          onPress={onSignForms}
          disabled={!canSign}
          activeOpacity={0.7}
        >
          <SignatureIcon />
          <Text
            style={[
              styles.signButtonText,
              !canSign && styles.signButtonTextDisabled,
            ]}
          >
            Tap Here to sign Forms for this Appointment
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <FileText size={48} color={colors.textLight} />
      <Text style={styles.emptyStateTitle}>No forms found</Text>
      <Text style={styles.emptyStateText}>
        There are no forms associated with this appointment.
      </Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={[]}>
        {renderHeader()}
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      {renderHeader()}
      {renderSignButton()}

      <FlatList
        data={forms}
        keyExtractor={item => item.id || item._id}
        renderItem={({ item }) => (
          <FilledFormCard form={item} onViewForm={onViewForm} />
        )}
        contentContainerStyle={[
          styles.listContent,
          forms.length === 0 && styles.emptyListContent,
        ]}
        ListEmptyComponent={renderEmptyState}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signButtonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  signButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 8,
  },
  signButtonDisabled: {
    backgroundColor: colors.border,
  },
  signButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  signButtonTextDisabled: {
    color: colors.textLight,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 5,
  },
  emptyListContent: {
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default ClientAppointmentFormsScreen;
