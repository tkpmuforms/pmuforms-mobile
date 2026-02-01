import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import AppointmentCard from '../../components/clients/AppointmentCard';
import AppointmentCardSkeleton from '../../components/skeleton/AppointmentCardSkeleton';
import DeleteModal from '../../components/clients/DeleteModal';
import ScreenHeader from '../../components/layout/ScreenHeader';
import {
  DeleteAppointment,
  getAppointmentsForCustomer,
  getCustomerById,
} from '../../services/artistServices';
import { ClientAppointmentData } from '../../types';
import { colors } from '../../theme/colors';

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
        await DeleteAppointment(appointmentToDelete);
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
    <ScreenHeader
      title={`${clientName}'s Appointments`}
      subtitle={`${appointments.length} ${
        appointments.length === 1 ? 'Appointment' : 'Appointments'
      }`}
      onBack={() => navigation.goBack()}
    />
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
      <SafeAreaView style={styles.container} edges={[]}>
        {renderHeader()}
        <View style={styles.skeletonContainer}>
          {[1, 2, 3, 4].map(key => (
            <AppointmentCardSkeleton key={key} />
          ))}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={[]}>
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

      {showDeleteAppointment && (
        <DeleteModal
          visible={showDeleteAppointment}
          headerText="Delete Appointment"
          shorterText="Are you sure you want to delete this appointment? This action cannot be undone."
          onClose={() => setShowDeleteAppointment(false)}
          handleDelete={handleDeleteConfirm}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skeletonContainer: {
    padding: 16,
    gap: 12,
  },
  header: {
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',

    gap: 12,
  },
  backButton: {
    padding: 8,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },

  listContent: {
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
    color: colors.black,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default ClientAppointmentsScreen;
