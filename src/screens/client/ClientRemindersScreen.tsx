import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { Plus, ArrowLeft } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { Reminder } from '../../types';
import ReminderCard from '../../components/clients/ReminderCard';
import DeleteModal from '../../components/clients/DeleteModal';
import {
  getRemindersByCustomer,
  createReminder,
  deleteReminder,
} from '../../services/artistServices';

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

  const handleSaveReminder = async (reminderData: {
    date: string;
    time: string;
    message: string;
  }) => {
    try {
      const response = await createReminder({
        customerId: clientId,
        reminderDate: reminderData.date,
        reminderTime: reminderData.time,
        message: reminderData.message,
      });
      const newReminder = response.data.reminder;
      setReminders(prev => [newReminder, ...prev]);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Reminder set successfully',
      });
    } catch (error) {
      console.error('Error saving reminder:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to set reminder',
      });
      throw error;
    }
  };

  const handleAddReminder = () => {
    navigation.navigate('AddReminder', {
      clientId,
      clientName: client?.name,
      onSave: handleSaveReminder,
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

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={24} color="#000000" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>
            {client?.name || 'Client'}'s Reminders
          </Text>
          <Text style={styles.headerSubtitle}>
            {reminders.length}{' '}
            {reminders.length === 1 ? 'Reminder' : 'Reminders'}
          </Text>
        </View>
      </View>
      <TouchableOpacity style={styles.addButton} onPress={handleAddReminder}>
        <Plus size={20} color="#fff" />
        <Text style={styles.addButtonText}>Set Reminder</Text>
      </TouchableOpacity>
    </View>
  );

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
          <ActivityIndicator size="large" color="#8e2d8e" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}

      <FlatList
        data={reminders}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ReminderCard reminder={item} onDelete={handleDeleteReminder} />
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
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  backButton: {
    padding: 8,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8e2d8e',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
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
    color: '#000000',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default ClientRemindersScreen;
