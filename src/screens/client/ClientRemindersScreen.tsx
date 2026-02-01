import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { Alarm } from '../../../assets/svg';
import DeleteModal from '../../components/clients/DeleteModal';
import ReminderCard from '../../components/clients/ReminderCard';
import ScreenHeader from '../../components/layout/ScreenHeader';
import {
  deleteReminder,
  getRemindersByCustomer,
} from '../../services/artistServices';
import { Reminder } from '../../types';
import { colors } from '../../theme/colors';

interface ClientRemindersScreenProps {}

const ClientRemindersScreen: React.FC<ClientRemindersScreenProps> = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { clientId, client } = route.params as {
    clientId: string;
    client?: any;
  };

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState<Reminder | null>(
    null,
  );
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (clientId) {
      loadReminders();
    }
  }, [clientId]);

  // Refresh reminders when returning from add screen
  useFocusEffect(
    useCallback(() => {
      if (clientId) {
        loadReminders();
      }
    }, [clientId]),
  );

  const loadReminders = async () => {
    try {
      setLoading(true);
      const response = await getRemindersByCustomer(clientId);
      console.log('Reminders response:', response);
      setReminders(response.data?.reminders || []);
    } catch (error) {
      console.error('Error loading reminders:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to load reminders',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddReminder = () => {
    navigation.navigate('AddReminder', {
      clientId,
      clientName: client?.name,
    });
  };

  const handleEditReminder = (reminder: Reminder) => {
    navigation.navigate('AddReminder', {
      clientId,
      clientName: client?.name,
      reminder,
    });
  };

  const handleDeleteReminder = (reminder: Reminder) => {
    setSelectedReminder(reminder);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedReminder) {
      try {
        await deleteReminder(selectedReminder.id);
        setReminders(prev => prev.filter(r => r.id !== selectedReminder.id));
        setShowDeleteModal(false);
        setSelectedReminder(null);
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Reminder deleted successfully',
        });
      } catch (error) {
        console.error('Error deleting reminder:', error);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to delete reminder',
        });
      }
    }
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateTitle}>No reminders set</Text>
      <Text style={styles.emptyStateText}>
        Set reminders to stay on top of client communications
      </Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      <ScreenHeader
        title={`${client?.name || 'Client'}'s Reminders`}
        subtitle={`${reminders.length} ${
          reminders.length === 1 ? 'Reminder' : 'Reminders'
        }`}
        onBack={() => navigation.goBack()}
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAddReminder}>
        <Alarm />
        <Text style={styles.addButtonText}>Tap Here to Add a New Reminder</Text>
      </TouchableOpacity>

      <FlatList
        data={reminders}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ReminderCard
            reminder={item}
            onDelete={handleDeleteReminder}
            onEdit={handleEditReminder}
          />
        )}
        contentContainerStyle={[
          styles.listContent,
          reminders.length === 0 && styles.emptyListContent,
        ]}
        ListEmptyComponent={renderEmptyState}
      />

      {showDeleteModal && (
        <DeleteModal
          visible={showDeleteModal}
          headerText="Delete Reminder"
          shorterText="Are you sure you want to delete this reminder?"
          onClose={() => setShowDeleteModal(false)}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F4EAF4',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
  },
  addButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  listContent: {
    paddingVertical: 16,
    paddingHorizontal: 16,
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

export default ClientRemindersScreen;
