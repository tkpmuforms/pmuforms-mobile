import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AddClientModal from '../../components/clients/AddClientModal';
import AppointmentCard from '../../components/dashboard/AppointmentCard';
import FeaturesModal from '../../components/dashboard/FeaturesModal';
import FormLinkModal from '../../components/dashboard/FormLinkModal';
import MetricsCard from '../../components/dashboard/MetricsCard';
import QuickActionCard from '../../components/dashboard/QuickActionCard';
import SubscriptionModal from '../../components/modals/SubscriptionModal';
import useAuth from '../../hooks/useAuth';
import {
  getArtistAppointmentsPaginated,
  getArtistForms,
  getCustomerById,
  getMyMetrics,
} from '../../services/artistServices';
import { colors } from '../../theme/colors';
import { Appointment } from '../../types';
import { formatAppointmentTime, transformFormData } from '../../utils/utils';

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

  const hasActiveSubscription = false;
  // user?.appStorePurchaseActive || user?.stripeSubscriptionActive;

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
      const metricsResponse = await getMyMetrics();
      setMetrics(metricsResponse.data?.metrics);
      setMetricsLoading(false);
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
    <SafeAreaView style={styles.container} edges={[]}>
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
              {user?.businessName || 'Glow Beauty Bar'}
            </Text>
          </View>
        </View>

        {/* Setup Banner */}
        {/* <View style={styles.setupBanner}>
          <Text style={styles.setupIcon}>💼</Text>
          <View style={styles.setupContent}>
            <Text style={styles.setupTitle}>Let's complete your setup</Text>
            <Text style={styles.setupSubtitle}>
              Include your business name, address, contact details, and logo for
              brand visibility.
            </Text>
          </View>
          <TouchableOpacity style={styles.setupButton}>
            <Text style={styles.setupButtonText}>Set Up My Business</Text>
          </TouchableOpacity>
        </View> */}

        {/* Metrics */}
        <View style={styles.section}>
          <View style={styles.metricsGrid}>
            <View style={styles.metricsRow}>
              <View style={styles.metricItem}>
                <MetricsCard
                  title="Total Clients"
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
            <Text style={styles.sectionTitle}>Next Appointment</Text>
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
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <View style={styles.quickActionsRow}>
              <View style={styles.quickActionItem}>
                <QuickActionCard
                  title={quickActions[0].title}
                  icon={quickActions[0].icon}
                  onPress={quickActions[0].onPress}
                />
              </View>
              <View style={styles.quickActionItem}>
                <QuickActionCard
                  title={quickActions[1].title}
                  icon={quickActions[1].icon}
                  onPress={quickActions[1].onPress}
                />
              </View>
            </View>
            <QuickActionCard
              title={quickActions[2].title}
              icon={quickActions[2].icon}
              onPress={quickActions[2].onPress}
            />
          </View>
        </View>
      </ScrollView>

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
    paddingTop: 16,
    paddingBottom: 20,
  },
  header: {
    marginBottom: 16,
  },
  welcomeSection: {
    marginBottom: 0,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 2,
  },
  welcomeSubtitle: {
    fontSize: 12,
    color: '#64748b',
  },
  setupBanner: {
    backgroundColor: '#f3e8ff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    gap: 12,
  },
  setupIcon: {
    fontSize: 32,
  },
  setupContent: {
    gap: 4,
  },
  setupTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  setupSubtitle: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 16,
  },
  setupButton: {
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  setupButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    marginBottom: 20,
    marginTop: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: 'RedditSans-Regular',
    fontWeight: '400',
    color: '#000000',
    letterSpacing: -0.12,
    lineHeight: 12,
    marginBottom: 4,
  },
  viewAllButton: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  },
  quickActionsGrid: {
    gap: 12,
  },
  quickActionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  quickActionItem: {
    flex: 1,
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
    width: Dimensions.get('window').width * 0.7,
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
