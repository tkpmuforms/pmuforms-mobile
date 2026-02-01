import Clipboard from '@react-native-clipboard/clipboard';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  Calendar,
  Clock,
  Copy,
  Edit,
  Mail,
  Phone,
  Send,
  Trash2,
  User,
} from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import DeleteModal from '../../components/clients/DeleteModal';
import MetricsCard from '../../components/dashboard/MetricsCard';
import ScreenHeader from '../../components/layout/ScreenHeader';
import {
  deleteCustomer,
  getCustomerById,
  getCustomerMetrics,
} from '../../services/artistServices';
import { ClientDetail, ClientMetrics } from '../../types';
import { RootStackParamList } from '../../types/navigation';
import { colors } from '../../theme/colors';

type ClientDetailsNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ClientDetails'
>;
type ClientDetailsRouteProp = RouteProp<RootStackParamList, 'ClientDetails'>;

interface ClientDetailsScreenProps {}

const ClientDetailsScreen: React.FC<ClientDetailsScreenProps> = () => {
  const navigation = useNavigation<ClientDetailsNavigationProp>();
  const route = useRoute<ClientDetailsRouteProp>();
  const { clientId } = route.params;
  const [client, setClient] = useState<ClientDetail | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [metricsLoading, setMetricsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteClient, setShowDeleteClient] = useState(false);
  const [clientMetrics, setClientMetrics] = useState<ClientMetrics | null>(
    null,
  );

  const fetchClientDetails = useCallback(async () => {
    if (!clientId) {
      setError('Client ID is required');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await getCustomerById(clientId);
      const customer = response?.data.customer;

      if (customer) {
        setClient({
          id: customer.id,
          name: customer.name,
          email: customer.email || 'No email provided',
          phone: customer?.info?.cell_phone,
        });
      } else {
        setError('Client not found');
      }
    } catch (err) {
      console.error('Error fetching client details:', err);
      setError('Failed to load client details. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [clientId]);

  const fetchClientMetrics = useCallback(async () => {
    if (!clientId) return;

    try {
      setMetricsLoading(true);
      const metricsResponse = await getCustomerMetrics(clientId);
      setClientMetrics(metricsResponse?.data?.metrics || null);
    } catch (err) {
      console.error('Error fetching client metrics:', err);
    } finally {
      setMetricsLoading(false);
    }
  }, [clientId]);

  useEffect(() => {
    fetchClientDetails();
    fetchClientMetrics();
  }, [fetchClientDetails, fetchClientMetrics]);

  const handleCopyToClipboard = async (text: string, label: string) => {
    Clipboard.setString(text);
    Toast.show({
      type: 'success',
      text1: 'Copied',
      text2: `${label} copied to clipboard`,
    });
  };

  const handleEmailPress = () => {
    if (client?.email) {
      Linking.openURL(`mailto:${client.email}`);
    }
  };

  const handlePhonePress = () => {
    if (client?.phone) {
      Linking.openURL(`tel:${client.phone}`);
    }
  };

  const handleDeleteClient = async () => {
    try {
      await deleteCustomer(clientId);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Client deleted successfully',
      });
      navigation.goBack();
    } catch (err) {
      console.error('Error deleting client:', err);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to delete client',
      });
    }
  };

  const quickActions = [
    {
      icon: <Calendar size={20} color={colors.primary} />,
      title: 'View Appointment',
      onPress: () =>
        navigation.navigate('ClientAppointments', { clientId, client }),
      isDelete: false,
    },
    {
      icon: <Send size={20} color={colors.primary} />,
      title: 'Send Consent Form',
      onPress: () =>
        navigation.navigate('SendConsentForm', {
          clientId,
          clientName: client?.name || 'Client',
        }),
      isDelete: false,
    },
    {
      icon: <Clock size={20} color={colors.primary} />,
      title: 'Set Reminders',
      onPress: () =>
        navigation.navigate('ClientReminders', { clientId, client }),
      isDelete: false,
    },
    {
      icon: <User size={20} color={colors.primary} />,
      title: 'View Notes',
      onPress: () => navigation.navigate('ClientNotes', { clientId, client }),
      isDelete: false,
    },
    {
      icon: <Trash2 size={20} color="#FF3B30" />,
      title: 'Delete this Client',
      onPress: () => setShowDeleteClient(true),
      isDelete: true,
    },
  ];

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !client) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error || 'Client not found'}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={fetchClientDetails}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      <ScreenHeader
        title={client.name}
        onBack={() => navigation.goBack()}
        rightComponent={
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() =>
              navigation.navigate('EditClient', { clientId, client: client! })
            }
          >
            <Edit size={20} color={colors.primary} />
          </TouchableOpacity>
        }
      />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.metricsContainer}>
          {metricsLoading ? (
            <>
              <View
                style={[styles.metricCardWrapper, styles.metricPlaceholder]}
              >
                <ActivityIndicator size="small" color={colors.primary} />
              </View>
              <View
                style={[styles.metricCardWrapper, styles.metricPlaceholder]}
              >
                <ActivityIndicator size="small" color="#10b981" />
              </View>
            </>
          ) : clientMetrics ? (
            <>
              <View style={styles.metricCardWrapper}>
                <MetricsCard
                  title="Pending Forms"
                  value={clientMetrics.pendingForms.toString()}
                  icon="file-text"
                  color={colors.primary}
                />
              </View>
              <View style={styles.metricCardWrapper}>
                <MetricsCard
                  title="Total Appointments"
                  value={clientMetrics.totalAppointments.toString()}
                  icon="calendar"
                  color="#10b981"
                />
              </View>
            </>
          ) : null}
        </View>

        <View style={styles.infoCard}>
          <View style={styles.contactSection}>
            <View style={styles.contactItem}>
              <Mail size={20} color="#666" />
              <Text style={styles.contactText}>{client.email}</Text>
              <TouchableOpacity
                style={styles.contactActionButton}
                onPress={handleEmailPress}
              >
                <Send size={16} color={colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleCopyToClipboard(client.email, 'Email')}
              >
                <Copy size={16} color={colors.primary} />
              </TouchableOpacity>
            </View>

            {client.phone && (
              <View style={styles.contactItem}>
                <Phone size={20} color="#666" />
                <Text style={styles.contactText}>{client.phone}</Text>
                <TouchableOpacity
                  style={styles.contactActionButton}
                  onPress={handlePhonePress}
                >
                  <Phone size={16} color="#10b981" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleCopyToClipboard(client.phone!, 'Phone')}
                >
                  <Copy size={16} color={colors.primary} />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsList}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.quickActionCard,
                  action.isDelete && styles.quickActionCardDelete,
                ]}
                onPress={action.onPress}
              >
                <View style={styles.quickActionIcon}>{action.icon}</View>
                <Text
                  style={[
                    styles.quickActionText,
                    action.isDelete && styles.quickActionTextDelete,
                  ]}
                >
                  {action.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {showDeleteClient && (
        <DeleteModal
          visible={showDeleteClient}
          headerText="Delete Client"
          shorterText={`Are you sure you want to delete ${client.name}? This action cannot be undone.`}
          onClose={() => setShowDeleteClient(false)}
          handleDelete={handleDeleteClient}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 22,
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    gap: 12,
  },
  backButton: {
    padding: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,

    gap: 8,
  },
  actionButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  clientName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.black,
    flex: 1,
  },
  infoCard: {
    backgroundColor: colors.white,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 22,
  },
  contactSection: {
    width: '100%',
    gap: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 22,
  },
  contactText: {
    flex: 1,
    fontSize: 16,
    color: colors.black,
  },
  contactActionButton: {
    padding: 4,
  },
  metricsContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 16,
    gap: 12,
  },
  metricCardWrapper: {
    flex: 1,
  },
  metricPlaceholder: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActionsContainer: {
    marginHorizontal: 16,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: 16,
  },
  actionsList: {},
  quickActionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FBFBFB',
    borderRadius: 12,
    padding: 10,
    borderBottomColor: '#e0e0e0',
    borderBottomWidth: 1,
  },
  quickActionCardDelete: {
    backgroundColor: '#FFF5F5',
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.black,
    flex: 1,
  },
  quickActionTextDelete: {
    color: '#FF3B30',
  },
});

export default ClientDetailsScreen;
