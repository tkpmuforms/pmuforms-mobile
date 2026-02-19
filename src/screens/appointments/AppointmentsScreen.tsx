import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Search,
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import AppointmentCard from '../../components/dashboard/AppointmentCard';
import ScreenHeader from '../../components/layout/ScreenHeader';
import {
  getArtistAppointmentsPaginated,
  getCustomerById,
} from '../../services/artistServices';
import { colors } from '../../theme/colors';
import { Appointment, AppointmentsResponse } from '../../types';
import { formatAppointmentTime } from '../../utils/utils';

const AppointmentsScreen = ({ navigation }: any) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [customers, setCustomers] = useState<
    Record<string, { name: string; avatar?: string }>
  >({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [metadata, setMetadata] = useState({
    total: 0,
    lastPage: 1,
  });

  const perPage = 10;

  const fetchPageAppointments = async (page: number) => {
    try {
      setLoading(true);
      const response = await getArtistAppointmentsPaginated(page, perPage);
      const data: AppointmentsResponse = response?.data;

      if (data?.appointments) {
        setAppointments(data.appointments || []);
        setMetadata({
          total: data?.metadata?.total || 0,
          lastPage: data?.metadata?.lastPage || 1,
        });
        await fetchCustomersData(data.appointments || []);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to fetch appointments',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomersData = async (appointmentsList: Appointment[]) => {
    const uniqueCustomerIds = [
      ...new Set(
        (appointmentsList || []).map(apt => apt?.customerId).filter(Boolean),
      ),
    ].filter(Boolean) as string[];

    if (uniqueCustomerIds.length === 0) return;

    try {
      const customerPromises = uniqueCustomerIds.map(customerId =>
        getCustomerById(customerId).catch(error => {
          console.error(`Error fetching customer ${customerId}:`, error);
          return null;
        }),
      );

      const customerResponses = await Promise.all(customerPromises);
      const customerMap = customerResponses.reduce((acc, response, index) => {
        if (response?.data?.customer) {
          const customerId = uniqueCustomerIds[index];
          const customer = response.data.customer;
          acc[customerId] = {
            name: customer?.info?.client_name || 'Unknown Client',
            avatar: customer?.info?.avatar_url,
          };
        }
        return acc;
      }, {} as Record<string, { name: string; avatar?: string }>);

      setCustomers(prev => ({ ...prev, ...customerMap }));
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  useEffect(() => {
    fetchPageAppointments(currentPage);
  }, [currentPage]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPageAppointments(currentPage);
    setRefreshing(false);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= metadata.lastPage) {
      setCurrentPage(page);
    }
  };

  const getCustomerName = (customerId: string) =>
    customers[customerId]?.name || 'Client 1';

  const getCustomerAvatar = (customerId: string) => {
    const customer = customers[customerId];
    if (customer?.avatar) return customer.avatar;

    const customerName = customer?.name || 'Client 1';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      customerName,
    )}&background=A858F0&color=fff&size=40`;
  };

  const filteredAppointments = appointments.filter(appointment => {
    if (!searchTerm.trim()) return true;
    const customerName = getCustomerName(appointment.customerId).toLowerCase();
    return customerName.includes(searchTerm.toLowerCase());
  });

  const renderPagination = () => {
    if (metadata.lastPage <= 1) return null;

    return (
      <View style={styles.paginationContainer}>
        <TouchableOpacity
          style={[
            styles.paginationArrow,
            currentPage === 1 && styles.paginationArrowDisabled,
          ]}
          onPress={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft
            size={24}
            color={currentPage === 1 ? colors.border : colors.text}
          />
        </TouchableOpacity>

        <Text style={styles.paginationText}>
          Page {currentPage} of {metadata.lastPage}
        </Text>

        <TouchableOpacity
          style={[
            styles.paginationArrow,
            currentPage === metadata.lastPage && styles.paginationArrowDisabled,
          ]}
          onPress={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === metadata.lastPage}
        >
          <ChevronRight
            size={24}
            color={
              currentPage === metadata.lastPage ? colors.border : colors.text
            }
          />
        </TouchableOpacity>
      </View>
    );
  };

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScreenHeader
          title="All Appointments"
          onBack={() => navigation.goBack()}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      <View style={styles.header}>
        <ScreenHeader
          title="All Appointments"
          subtitle={`Total: ${metadata.total} appointments`}
          onBack={() => navigation.goBack()}
        />

        <View style={styles.searchContainer}>
          <Search
            size={20}
            color={colors.textLight}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by client name..."
            placeholderTextColor={colors.textLighter}
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {filteredAppointments.length === 0 ? (
          <View style={styles.emptyState}>
            <Calendar size={48} color={colors.textLighter} />
            <Text style={styles.emptyTitle}>No appointments found</Text>
            <Text style={styles.emptySubtitle}>
              {searchTerm
                ? 'No appointments match your search'
                : "You haven't scheduled any appointments yet"}
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.appointmentsGrid}>
              {filteredAppointments.map(appointment => (
                <AppointmentCard
                  key={appointment.id}
                  name={
                    appointment?.customerId
                      ? getCustomerName(appointment.customerId)
                      : ' Client'
                  }
                  avatar={getCustomerAvatar(appointment.customerId)}
                  time={formatAppointmentTime(appointment.date)}
                  service={
                    appointment.serviceDetails[0]?.service ||
                    'Service not specified'
                  }
                  onPress={() =>
                    navigation.navigate('ClientAppointments', {
                      clientId: appointment.customerId,
                    })
                  }
                />
              ))}
            </View>
            {renderPagination()}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.background,
  },
  searchContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIcon: {
    position: 'absolute',
    left: 12,
    zIndex: 1,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    paddingLeft: 44,
    paddingRight: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    fontSize: 14,
    color: colors.text,
    backgroundColor: colors.surfaceLight,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 10,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
  },
  appointmentsGrid: {},
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',

    gap: 20,
  },
  paginationArrow: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationArrowDisabled: {
    opacity: 0.5,
  },
  paginationText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
    minWidth: 120,
    textAlign: 'center',
  },
});

export default AppointmentsScreen;
