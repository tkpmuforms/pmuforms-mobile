import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Bell, Calendar } from 'lucide-react-native';
import { formatAppointmentTime } from '../../utils/utils';

interface Reminder {
  id: string;
  type: 'check-in' | 'follow-up';
  sendAt: string;
  note: string;
  customerId: string;
}

interface ReminderCardProps {
  reminder: Reminder;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const ReminderCard: React.FC<ReminderCardProps> = ({
  reminder,
  onEdit,
  onDelete,
}) => {
  return (
    <View style={styles.reminderCard}>
      <View style={styles.header}>
        <View
          style={[
            styles.iconContainer,
            reminder.type === 'check-in'
              ? styles.checkInIcon
              : styles.followUpIcon,
          ]}
        >
          {reminder.type === 'check-in' ? (
            <Calendar size={24} color="white" />
          ) : (
            <Bell size={24} color="white" />
          )}
        </View>
        <View style={styles.content}>
          <Text style={styles.date}>
            {formatAppointmentTime(reminder.sendAt)}
          </Text>
          <Text style={styles.note}>{reminder.note}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => onEdit(reminder.id)}
        >
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => onDelete(reminder.id)}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  reminderCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  header: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkInIcon: {
    backgroundColor: '#3b82f6',
  },
  followUpIcon: {
    backgroundColor: '#f59e0b',
  },
  content: {
    flex: 1,
  },
  date: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  note: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  editButton: {
    flex: 1,
    backgroundColor: '#8e2d8e',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#ef4444',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ReminderCard;
