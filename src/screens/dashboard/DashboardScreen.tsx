import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus } from 'lucide-react-native';
import useAuth from '../../hooks/useAuth';
import { Appointment } from '../../types';
import { colors } from '../../theme/colors';
import {
  getArtistAppointmentsPaginated,
  getArtistForms,
  getCustomerById,
  getMyMetrics,
} from '../../services/artistServices';
import { formatAppointmentTime, transformFormData } from '../../utils/utils';
import MetricsCard from '../../components/dashboard/MetricsCard';
import QuickActionCard from '../../components/dashboard/QuickActionCard';
import AppointmentCard from '../../components/dashboard/AppointmentCard';
import FormCard from '../../components/forms/FormCard';
import AddClientModal from '../../components/clients/AddClientModal';
import FormLinkModal from '../../components/dashboard/FormLinkModal';
import FeaturesModal from '../../components/dashboard/FeaturesModal';
import SubscriptionModal from '../../components/modals/SubscriptionModal';

interface Metrics {
  totalClients: number;
  formsShared: number;
  pendingSubmissions: number;
  todaysSchedule: number;
}

const DashboardScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showFeaturesModal, setShowFeaturesModal] = useState(false);
  const [showFormLinkModal, setShowFormLinkModal] = useState(false);
  const [showAddClient, setShowAddClient] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [metricsLoading, setMetricsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [customers, setCustomers] = useState<
    Record<string, { name: string; avatar?: string }>
  >({});
  const [recentForms, setRecentForms] = useState<any[]>([]);

  const hasActiveSubscription =
    user?.appStorePurchaseActive || user?.stripeSubscriptionActive;

  const quickActions = [
    {
      title: 'Add New Client',
      icon: 'user-plus',
      onPress: () => setShowAddClient(true),
    },
    {
      title: 'Manage Forms',
      icon: 'file-text',
      onPress: () => navigation.navigate('Forms'),
    },
    {
      title: 'Send Form',
      icon: 'send',
      onPress: () => {
        if (!hasActiveSubscription) {
          setShowSubscriptionModal(true);
        } else {
          setShowFormLinkModal(true);
        }
      },
    },
  ];

  const getCustomerName = (customerId: string) =>
    customers[customerId]?.name || 'Client 1';

  const getCustomerAvatar = (customerId: string) => {
    const customerAvatar = customers[customerId]?.avatar;
    if (customerAvatar) return customerAvatar;

    const customerName = customers[customerId]?.name || 'Unknown Client';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      customerName,
    )}&background=A858F0&color=fff&size=40`;
  };

  const refreshMetrics = async () => {
    try {
      const metricsResponse = await getMyMetrics();
      setMetrics(metricsResponse.data?.metrics);
    } catch (error) {
      console.error('Error refreshing metrics:', error);
    }
  };

  const fetchData = async () => {
    try {
      // Fetch appointments and customers
      const appointmentsResponse = await getArtistAppointmentsPaginated();
      const returnedApp = appointmentsResponse.data?.appointments || [];
      setAppointments(returnedApp);

      const displayedAppointments = appointments.slice(0, 4);
      const uniqueCustomerIds = [
        ...new Set(
          displayedAppointments.map((apt: any) => apt.customerId as string),
        ),
      ] as string[];

      if (uniqueCustomerIds.length > 0) {
        const customerPromises = uniqueCustomerIds.map(customerId =>
          getCustomerById(customerId).catch(error => {
            console.error(`Error fetching customer ${customerId}:`, error);
            return null;
          }),
        );

        const customerResponses = await Promise.all(customerPromises);
        const customerMap = customerResponses.reduce((acc, response, index) => {
          if (response && response.data) {
            const customerId = uniqueCustomerIds[index];
            const customer = response.data?.customer;
            acc[customerId] = {
              name: customer.info?.client_name,
              avatar: customer.info?.avatar_url,
            };
          }
          return acc;
        }, {} as Record<string, { name: string; avatar?: string }>);

        setCustomers(customerMap);
      }

      // Fetch metrics
      const metricsResponse = await getMyMetrics();
      setMetrics(metricsResponse.data?.metrics);
      setMetricsLoading(false);

      // Fetch forms
      const response = await getArtistForms();
      if (response && response.data && response.data.forms) {
        const transformedForms = response.data.forms.map(transformFormData);
        setRecentForms(transformedForms);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
      setMetricsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    console.log('=== USER OBJECT DEBUG ===');
    console.log('Full user object:', JSON.stringify(user, null, 2));
    console.log('Business Name:', user?.businessName);
    console.log('Has subscription:', hasActiveSubscription);
    console.log('========================');
  }, [user]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const handleModalFlow = {
    closeSubscription: () => setShowSubscriptionModal(false),
    showFeatures: () => {
      setShowSubscriptionModal(false);
      setShowFeaturesModal(true);
    },
    showSubscription: () => {
      setShowFeaturesModal(false);
      setShowSubscriptionModal(true);
    },
    closeFeatures: () => setShowFeaturesModal(false),
    closeFormLink: () => setShowFormLinkModal(false),
    closeAddClient: () => setShowAddClient(false),
    closeAddClientAndRefresh: async () => {
      setShowAddClient(false);
      await refreshMetrics();
    },
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeTitle}>
              {user?.businessName
                ? `Hey, ${user.businessName} 👋`
                : 'Hey there 👋'}
            </Text>
            <Text style={styles.welcomeSubtitle}>
              Here's your activity for today
            </Text>
          </View>
          <TouchableOpacity
            style={styles.addClientButton}
            onPress={() => setShowAddClient(true)}
          >
            <Plus size={16} color="#fff" />
            <Text style={styles.addClientButtonText}>Add New Client</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>QUICK ACTIONS</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action, index) => (
              <QuickActionCard
                key={index}
                title={action.title}
                icon={action.icon}
                onPress={action.onPress}
              />
            ))}
          </View>
        </View>

        {/* Metrics */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>KEY METRICS</Text>
            <TouchableOpacity style={styles.filterButton}>
              <Text style={styles.filterButtonText}>Last 7 days</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.metricsGrid}>
            <View style={styles.metricsRow}>
              <View style={styles.metricItem}>
                <MetricsCard
                  title="Total   Clients"
                  value={
                    metricsLoading
                      ? 'loading'
                      : metrics?.totalClients?.toString() || '0'
                  }
                  icon="users"
                  color={colors.primary}
                  onPress={() => navigation.navigate('Clients')}
                />
              </View>
              <View style={styles.metricItem}>
                <MetricsCard
                  title="Forms Shared"
                  value={
                    metricsLoading
                      ? 'loading'
                      : metrics?.formsShared?.toString() || '0'
                  }
                  icon="file-text"
                  color={colors.secondary}
                />
              </View>
            </View>
            <View style={styles.metricsRow}>
              <View style={styles.metricItem}>
                <MetricsCard
                  title="Pending Submissions"
                  value={
                    metricsLoading
                      ? 'loading'
                      : metrics?.pendingSubmissions?.toString() || '0'
                  }
                  icon="clock"
                  color={colors.warning}
                />
              </View>
              <View style={styles.metricItem}>
                <MetricsCard
                  title="Today's Schedule"
                  value={
                    metricsLoading
                      ? 'loading'
                      : metrics?.todaysSchedule?.toString() || '0'
                  }
                  icon="calendar"
                  color={colors.error}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Recent Appointments */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>RECENT APPOINTMENTS</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Appointments')}
            >
              <Text style={styles.viewAllButton}>View all</Text>
            </TouchableOpacity>
          </View>
          {appointments.length === 0 ? (
            <Text style={styles.emptyText}>No appointments found</Text>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.appointmentsScrollContent}
              style={styles.appointmentsScroll}
            >
              {appointments.slice(0, 6).map(appointment => (
                <View key={appointment.id} style={styles.appointmentItem}>
                  <AppointmentCard
                    name={
                      appointment?.customerId
                        ? getCustomerName(appointment.customerId)
                        : 'Unknown Client'
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
                </View>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Recent Forms */}
        <View style={[styles.section, { marginBottom: 40 }]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>RECENT FORMS</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Forms')}>
              <Text style={styles.viewAllButton}>View all</Text>
            </TouchableOpacity>
          </View>
          {recentForms.length === 0 ? (
            <Text style={styles.emptyText}>No recent forms found</Text>
          ) : (
            <View style={styles.formsGrid}>
              {recentForms
                .sort(
                  (a: any, b: any) =>
                    new Date(b.updatedAt).getTime() -
                    new Date(a.updatedAt).getTime(),
                )
                .slice(0, 6)
                .map(form => (
                  <FormCard
                    key={form.id}
                    {...form}
                    onPreview={() =>
                      navigation.navigate('FormPreview', { formId: form.id })
                    }
                    onEdit={() =>
                      navigation.navigate('FormEdit', { formId: form.id })
                    }
                  />
                ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Modals */}
      {showAddClient && (
        <AddClientModal
          visible={showAddClient}
          onClose={handleModalFlow.closeAddClient}
          onSuccess={handleModalFlow.closeAddClientAndRefresh}
        />
      )}

      {showFormLinkModal && (
        <FormLinkModal
          visible={showFormLinkModal}
          onClose={handleModalFlow.closeFormLink}
          businessUri={user?.businessUri || ''}
        />
      )}

      {showSubscriptionModal && (
        <SubscriptionModal
          visible={showSubscriptionModal}
          onClose={handleModalFlow.closeSubscription}
          onShowFeatures={handleModalFlow.showFeatures}
          onSubscribe={handleModalFlow.closeSubscription}
        />
      )}

      {showFeaturesModal && (
        <FeaturesModal
          visible={showFeaturesModal}
          onClose={handleModalFlow.closeFeatures}
          onSubscribe={handleModalFlow.showSubscription}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
    marginTop: 16,
  },
  welcomeSection: {
    marginBottom: 16,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: '#64748b',
  },
  addClientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
  },
  addClientButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4a4a4b',
    letterSpacing: 1.2,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  filterButtonText: {
    fontSize: 12,
    color: '#64748b',
  },
  viewAllButton: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  },
  quickActionsGrid: {
    gap: 12,
  },
  metricsGrid: {
    gap: 12,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  metricItem: {
    flex: 1,
  },
  appointmentsScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  appointmentsScrollContent: {
    paddingRight: 20,
    gap: 12,
  },
  appointmentItem: {
    width: Dimensions.get('window').width * 0.85,
  },
  formsGrid: {
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    paddingVertical: 20,
  },
});

export default DashboardScreen;
