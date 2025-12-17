import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Send } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { ClientAppointmentData } from '../../types';
import AppointmentCard from '../../components/clients/AppointmentCard';
import SendConsentFormModal from '../../components/clients/SendConsentFormModal';
import DeleteModal from '../../components/clients/DeleteModal';
import {
  getAppointmentsForCustomer,
  getCustomerById,
  DeleteAppointment,
} from '../../services/artistServices';

interface ClientAppointmentsScreenProps {}

const ClientAppointmentsScreen: React.FC<
  ClientAppointmentsScreenProps
> = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { clientId, client } = route.params as {
    clientId: string;
    client?: any;
  };

  const [appointments, setAppointments] = useState<ClientAppointmentData[]>([]);
  const [loading, setLoading] = useState(false);
  const [clientName, setClientName] = useState<string>(client?.name || '');
  const [showSendConsentForm, setShowSendConsentForm] = useState(false);
  const [showDeleteAppointment, setShowDeleteAppointment] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const fetchData = async () => {
      if (!clientId) return;

      setLoading(true);
      try {
        if (!clientName) {
          const clientResponse = await getCustomerById(clientId);
          const fetchedClientName =
            clientResponse?.data?.customer?.name || 'Client';
          setClientName(fetchedClientName);
        }

        const appointmentsResponse = await getAppointmentsForCustomer(clientId);
        setAppointments(appointmentsResponse?.data?.appointments || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to load appointments',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [clientId]);

  const onViewForms = (appointmentId: string) => {
    navigation.navigate('ClientAppointmentForms', {
      clientId,
      appointmentId,
      clientName,
      appointments,
    });
  };

  const onDeleteAppointment = (appointmentId: string) => {
    setAppointmentToDelete(appointmentId);
    setShowDeleteAppointment(true);
  };

  const handleDeleteConfirm = async () => {
    if (appointmentToDelete) {
      try {
        // await DeleteAppointment(appointmentToDelete);
        setAppointments(prev =>
          prev.filter(apt => apt.id !== appointmentToDelete),
        );
        setShowDeleteAppointment(false);
        setAppointmentToDelete(null);
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Appointment deleted successfully',
        });
      } catch (error) {
        console.error('Error deleting appointment:', error);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to delete appointment',
        });
      }
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <Text style={styles.headerTitle}>{clientName}'s Appointments</Text>
        <Text style={styles.headerSubtitle}>
          {appointments.length}{' '}
          {appointments.length === 1 ? 'Appointment' : 'Appointments'}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.sendFormButton}
        onPress={() => setShowSendConsentForm(true)}
      >
        <Send size={20} color="#fff" />
        <Text style={styles.sendFormButtonText}>Send Form</Text>
      </TouchableOpacity>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateTitle}>No appointments yet</Text>
      <Text style={styles.emptyStateText}>
        Appointments for this client will appear here
      </Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8e2d8e" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}

      <FlatList
        data={appointments}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <AppointmentCard
            appointment={item}
            onViewForms={onViewForms}
            onDeleteAppointment={onDeleteAppointment}
          />
        )}
        contentContainerStyle={[
          styles.listContent,
          appointments.length === 0 && styles.emptyListContent,
        ]}
        ListEmptyComponent={renderEmptyState}
      />

      {showSendConsentForm && (
        <SendConsentFormModal
          clientId={clientId}
          clientEmail={client?.email || ''}
          onClose={() => setShowSendConsentForm(false)}
          onSuccess={() => setShowSendConsentForm(false)}
        />
      )}

      {showDeleteAppointment && (
        <DeleteModal
          visible={showDeleteAppointment}
          title="Delete Appointment"
          message="Are you sure you want to delete this appointment? This action cannot be undone."
          onClose={() => setShowDeleteAppointment(false)}
          onConfirm={handleDeleteConfirm}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerContent: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  sendFormButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8e2d8e',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  sendFormButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  listContent: {
    paddingVertical: 16,
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
    color: '#1a1a1a',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default ClientAppointmentsScreen;
