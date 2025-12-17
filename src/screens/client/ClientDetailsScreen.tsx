import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
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
  Clipboard,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import DeleteModal from '../../components/clients/DeleteModal';
import EditClientModal from '../../components/clients/EditClientModal';
import SendConsentFormModal from '../../components/clients/SendConsentFormModal';
import { ClientDetail, ClientMetrics } from '../../types';
import { RootStackParamList } from '../../types/navigation';
import {
  getCustomerById,
  getCustomerMetrics,
  deleteCustomer,
} from '../../services/artistServices';

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

  const [client, setClient] = useState<ClientDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [metricsLoading, setMetricsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditClient, setShowEditClient] = useState(false);
  const [showSendConsentForm, setShowSendConsentForm] = useState(false);
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
        setLoading(false);
      } else {
        setError('Client not found');
        setLoading(false);
        return;
      }

      const metricsResponse = await getCustomerMetrics(clientId);
      setClientMetrics(metricsResponse?.data?.metrics || null);
      setMetricsLoading(false);
    } catch (err) {
      console.error('Error fetching client details:', err);
      setError('Failed to load client details. Please try again.');
      setLoading(false);
      setMetricsLoading(false);
    }
  }, [clientId]);

  useEffect(() => {
    fetchClientDetails();
  }, [fetchClientDetails]);

  const handleCopyToClipboard = async (text: string, label: string) => {
    Clipboard.setString(text);
    Toast.show({
      type: 'success',
      text1: 'Copied',
      text2: `${label} copied to clipboard`,
    });
  };

  const handleDeleteClient = async () => {
    try {
      // await deleteCustomer(clientId);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Client deleted successfully',
      });
      navigation.goBack();
    } catch (error) {
      console.error('Error deleting client:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to delete client',
      });
    }
  };

  const quickActions = [
    {
      icon: <Calendar size={20} color="#8e2d8e" />,
      title: 'View Appointment',
      onPress: () =>
        navigation.navigate('ClientAppointments', { clientId, client }),
    },
    {
      icon: <Send size={20} color="#8e2d8e" />,
      title: 'Send Consent Form',
      onPress: () => setShowSendConsentForm(true),
    },
    {
      icon: <Clock size={20} color="#8e2d8e" />,
      title: 'Set Reminders',
      onPress: () =>
        navigation.navigate('ClientReminders', { clientId, client }),
    },
    {
      icon: <User size={20} color="#8e2d8e" />,
      title: 'View Notes',
      onPress: () => navigation.navigate('ClientNotes', { clientId, client }),
    },
  ];

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8e2d8e" />
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
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Actions */}
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setShowEditClient(true)}
          >
            <Edit size={20} color="#8e2d8e" />
            <Text style={styles.actionButtonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => setShowDeleteClient(true)}
          >
            <Trash2 size={20} color="#FF3B30" />
            <Text style={[styles.actionButtonText, styles.deleteButtonText]}>
              Delete
            </Text>
          </TouchableOpacity>
        </View>

        {/* Client Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {client.name
                  .split(' ')
                  .map(n => n[0])
                  .join('')
                  .toUpperCase()
                  .substring(0, 2)}
              </Text>
            </View>
          </View>
          <Text style={styles.clientName}>{client.name}</Text>

          {/* Contact Info */}
          <View style={styles.contactSection}>
            <View style={styles.contactItem}>
              <Mail size={20} color="#666" />
              <Text style={styles.contactText}>{client.email}</Text>
              <TouchableOpacity
                onPress={() => handleCopyToClipboard(client.email, 'Email')}
              >
                <Copy size={16} color="#8e2d8e" />
              </TouchableOpacity>
            </View>

            {client.phone && (
              <View style={styles.contactItem}>
                <Phone size={20} color="#666" />
                <Text style={styles.contactText}>{client.phone}</Text>
                <TouchableOpacity
                  onPress={() => handleCopyToClipboard(client.phone!, 'Phone')}
                >
                  <Copy size={16} color="#8e2d8e" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* Metrics */}
        {!metricsLoading && clientMetrics && (
          <View style={styles.metricsContainer}>
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>
                {clientMetrics.pendingForms}
              </Text>
              <Text style={styles.metricLabel}>Pending Forms</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>
                {clientMetrics.totalAppointments}
              </Text>
              <Text style={styles.metricLabel}>Total Appointments</Text>
            </View>
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={styles.quickActionCard}
                onPress={action.onPress}
              >
                <View style={styles.quickActionIcon}>{action.icon}</View>
                <Text style={styles.quickActionText}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Modals */}
      {showEditClient && (
        <EditClientModal
          client={client}
          onClose={() => setShowEditClient(false)}
          onSuccess={() => {
            setShowEditClient(false);
            fetchClientDetails();
          }}
        />
      )}

      {showSendConsentForm && (
        <SendConsentFormModal
          clientId={clientId}
          clientEmail={client.email}
          onClose={() => setShowSendConsentForm(false)}
          onSuccess={() => setShowSendConsentForm(false)}
        />
      )}

      {showDeleteClient && (
        <DeleteModal
          visible={showDeleteClient}
          title="Delete Client"
          message={`Are you sure you want to delete ${client.name}? This action cannot be undone.`}
          onClose={() => setShowDeleteClient(false)}
          onConfirm={handleDeleteClient}
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
  scrollContent: {
    paddingBottom: 24,
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
    paddingHorizontal: 32,
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#8e2d8e',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#fff',
    gap: 8,
  },
  actionButtonText: {
    color: '#8e2d8e',
    fontSize: 14,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#FFF5F5',
  },
  deleteButtonText: {
    color: '#FF3B30',
  },
  infoCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#8e2d8e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  clientName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 24,
  },
  contactSection: {
    width: '100%',
    gap: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  contactText: {
    flex: 1,
    fontSize: 16,
    color: '#1a1a1a',
  },
  metricsContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 16,
    gap: 12,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#8e2d8e',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  quickActionsContainer: {
    marginHorizontal: 16,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  quickActionIcon: {
    marginBottom: 12,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    textAlign: 'center',
  },
});

export default ClientDetailsScreen;
