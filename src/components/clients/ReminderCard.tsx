import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
  Calendar,
  Clock,
  Trash2,
  UserCheck,
  UserPlus,
} from 'lucide-react-native';
import { Reminder } from '../../types';

interface ReminderCardProps {
  reminder: Reminder;
  onDelete: (reminder: Reminder) => void;
  onEdit?: (reminder: Reminder) => void;
}

const ReminderCard: React.FC<ReminderCardProps> = ({
  reminder,
  onDelete,
  onEdit,
}) => {
  const reminderDate = new Date(reminder.sendAt);

  // Format as DD/MM/YYYY - HH:MM to match Figma design
  const displayDate = reminderDate.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  const displayTime = reminderDate.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const getIconForType = () => {
    if (reminder.type === 'check-in') {
      return <UserCheck size={24} color={reminder.sent ? '#666' : '#8e2d8e'} />;
    }
    return <UserPlus size={24} color={reminder.sent ? '#666' : '#8e2d8e'} />;
  };

  const getTypeLabel = () => {
    return reminder.type === 'check-in' ? 'Check-in' : 'Follow-up';
  };

  return (
    <View style={styles.card}>
      <View style={styles.iconContainer}>{getIconForType()}</View>

      <View style={styles.content}>
        <Text style={styles.message} numberOfLines={2}>
          {reminder.note}
        </Text>

        <View style={styles.detailsRow}>
          <Text style={styles.dateTimeText}>
            {displayDate} - {displayTime}
          </Text>
        </View>

        <Text style={styles.typeText}>{getTypeLabel()}</Text>

        {reminder.sent && (
          <View style={styles.sentBadge}>
            <Text style={styles.sentText}>Sent</Text>
          </View>
        )}
      </View>

      <View style={styles.actionButtons}>
        {onEdit && (
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => onEdit(reminder)}
          >
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => onDelete(reminder)}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    gap: 12,
  },
  iconContainer: {
    marginBottom: 4,
  },
  dateTimeText: {
    fontSize: 13,
    color: '#666',
  },
  typeText: {
    fontSize: 12,
    color: '#8e2d8e',
    fontWeight: '500',
    marginTop: 4,
  },
  sentBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 8,
  },
  sentText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#666',
  },
  actionButtons: {
    gap: 8,
  },
  editButton: {
    backgroundColor: '#8e2d8e',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  deleteButtonText: {
    color: '#FF3B30',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ReminderCard;
