import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Reminder } from '../../types';
import { CheckInIcon, FollowUpIcon } from '../../../assets/svg';
import { colors } from '../../theme/colors';

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
      return <FollowUpIcon />;
    }
    return <CheckInIcon />;
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>{getIconForType()}</View>
        <Text style={styles.dateTimeText}>
          {displayDate} - {displayTime}
        </Text>
      </View>

      <Text style={styles.message} numberOfLines={3}>
        {reminder.note}
      </Text>

      {reminder.sent && (
        <View style={styles.sentBadge}>
          <Text style={styles.sentText}>Sent</Text>
        </View>
      )}

      <View style={styles.buttonRow}>
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
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    marginBottom: 8,
    gap: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateTimeText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
  },
  message: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  sentBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  sentText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#666',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  editButton: {
    flex: 1,
    backgroundColor: '#A654CD',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  editButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '600',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: 'colors.black0D',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  deleteButtonText: {
    color: colors.black,
    fontSize: 15,
    fontWeight: '600',
  },
});

export default ReminderCard;
