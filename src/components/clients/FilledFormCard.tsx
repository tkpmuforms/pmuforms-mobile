import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AppointmentDetailsIcon, AppointmentIcon } from '../../../assets/svg';
import { FilledForm } from '../../types';
import { formatAppointmentTime } from '../../utils/utils';

interface FilledFormCardProps {
  form: FilledForm;
  onViewForm: (formTemplateId: string) => void;
}

const FilledFormCard: React.FC<FilledFormCardProps> = ({
  form,
  onViewForm,
}) => {
  const isCompleted =
    form.status === 'complete' ||
    form.status === 'completed' ||
    form.status === 'signed';

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onViewForm(form.formTemplateId)}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.formInfo}>
          <View style={styles.formIcon}>
            <AppointmentIcon />
          </View>
          <View style={styles.formContent}>
            <Text style={styles.formTitle} numberOfLines={1}>
              {form.formTemplate?.title || form.title || 'Untitled Form'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.statusSection}>
        <View style={styles.divider} />
        <View
          style={[
            styles.statusBadge,
            isCompleted ? styles.statusCompleted : styles.statusIncomplete,
          ]}
        >
          <Text
            style={[
              styles.statusText,
              isCompleted
                ? styles.statusTextCompleted
                : styles.statusTextIncomplete,
            ]}
          >
            {isCompleted ? 'Completed' : 'Forms Not Completed'}
          </Text>
        </View>
        <View style={styles.divider} />
      </View>

      <View style={styles.detailRow}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Appointment Date</Text>
          <View style={styles.detailValueRow}>
            <AppointmentDetailsIcon />
            <Text style={styles.detailValue} numberOfLines={1}>
              {formatAppointmentTime(form.createdAt)}
            </Text>
          </View>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Form Filled</Text>
          <View style={styles.detailValueRow}>
            <AppointmentDetailsIcon />
            <Text style={styles.detailValue} numberOfLines={1}>
              {formatAppointmentTime(form.updatedAt)}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  formInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  formIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#f3e8ff',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContent: {
    flex: 1,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  statusSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#e5e7eb',
  },
  statusBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 48,
  },
  statusCompleted: {
    backgroundColor: '#EBFAEF',
  },
  statusIncomplete: {
    backgroundColor: '#FFF6E9',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusTextCompleted: {
    color: '#34C759',
  },
  statusTextIncomplete: {
    color: '#FF9500',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
    marginBottom: 10,
  },
  detailValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailValue: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '600',
  },
});

export default FilledFormCard;
