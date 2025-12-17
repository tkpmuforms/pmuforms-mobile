import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Calendar, Clock, Trash2, Bell } from 'lucide-react-native';
import { Reminder } from '../../types';
import { formatDate, formatAppointmentTime } from '../../utils/utils';

interface ReminderCardProps {
  reminder: Reminder;
  onDelete: (reminder: Reminder) => void;
}

const ReminderCard: React.FC<ReminderCardProps> = ({ reminder, onDelete }) => {
  const displayDate = formatDate(reminder.reminderDate);
  const displayTime = formatAppointmentTime(reminder.reminderTime);

  return (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <Bell size={24} color={reminder.sent ? '#666' : '#8e2d8e'} />
      </View>

      <View style={styles.content}>
        <Text style={styles.message} numberOfLines={2}>
          {reminder.message}
        </Text>

        <View style={styles.detailsRow}>
          <View style={styles.detail}>
            <Calendar size={14} color="#666" />
            <Text style={styles.detailText}>{displayDate}</Text>
          </View>

          <View style={styles.detail}>
            <Clock size={14} color="#666" />
            <Text style={styles.detailText}>{displayTime}</Text>
          </View>
        </View>

        {reminder.sent && (
          <View style={styles.sentBadge}>
            <Text style={styles.sentText}>Sent</Text>
          </View>
        )}
      </View>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => onDelete(reminder)}
      >
        <Trash2 size={18} color="#FF3B30" />
      </TouchableOpacity>
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
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F9FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  message: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  detailsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  detail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 13,
    color: '#666',
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
  deleteButton: {
    padding: 8,
  },
});

export default ReminderCard;
