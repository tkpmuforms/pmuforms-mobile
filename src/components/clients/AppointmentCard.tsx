import { FileText, MoreVertical, Trash2 } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { AppointmentDetailsIcon, AppointmentIcon } from '../../../assets/svg';
import { ClientAppointmentData } from '../../types';
import { formatAppointmentTime } from '../../utils/utils';
import { colors } from '../../theme/colors';

interface AppointmentCardProps {
  appointment: ClientAppointmentData;
  onViewForms: (appointmentId: string) => void;
  onDeleteAppointment: (appointmentId: string) => void;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  onViewForms,
  onDeleteAppointment,
}) => {
  console.log('Rendering AppointmentCard for appointment:', appointment);
  const [showMenu, setShowMenu] = useState(false);
  const primaryService = appointment.serviceDetails?.[0];
  const serviceName = primaryService?.service || 'Unknown Service';
  const appointmentDate = formatAppointmentTime(appointment.date);
  const formFilledDate = appointment.allFormsCompleted
    ? `${appointmentDate}`
    : 'Not completed yet';

  const handleMenuClose = () => {
    setShowMenu(false);
  };

  const handleViewForms = () => {
    handleMenuClose();
    onViewForms(appointment.id);
  };

  const handleDelete = () => {
    handleMenuClose();
    onDeleteAppointment(appointment.id);
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onViewForms(appointment.id)}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.serviceInfo}>
          <View style={styles.serviceIcon}>
            <AppointmentIcon />
          </View>
          <View style={styles.serviceContent}>
            <Text style={styles.serviceName} numberOfLines={1}>
              {serviceName}
            </Text>
          </View>
          <View
            style={[
              styles.formStatusBadge,
              appointment.allFormsCompleted
                ? styles.formStatusCompleted
                : styles.formStatusNotCompleted,
            ]}
          >
            <Text
              style={[
                styles.formStatusText,
                appointment.allFormsCompleted
                  ? styles.formStatusTextCompleted
                  : styles.formStatusTextNotCompleted,
              ]}
            >
              {appointment.allFormsCompleted
                ? 'Forms Completed'
                : 'Forms Not Completed'}
            </Text>
          </View>
        </View>
      </View>

      {/* Details */}
      <View style={styles.detailRow}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Appointment Date</Text>
          <View style={styles.detailValueRow}>
            <AppointmentDetailsIcon />
            <Text style={styles.detailValue} numberOfLines={1}>
              {appointmentDate}
            </Text>
          </View>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Form Filled</Text>
          <View style={styles.detailValueRow}>
            <AppointmentDetailsIcon />
            <Text style={styles.detailValue} numberOfLines={1}>
              {formFilledDate}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setShowMenu(true)}
        >
          <MoreVertical size={16} color={colors.subtitleColor} />
        </TouchableOpacity>
      </View>

      <Modal
        visible={showMenu}
        transparent
        animationType="fade"
        onRequestClose={handleMenuClose}
      >
        <Pressable style={styles.modalOverlay} onPress={handleMenuClose}>
          <View style={styles.menuContainer}>
            <TouchableOpacity style={styles.menuItem} onPress={handleViewForms}>
              <FileText size={16} color={colors.black} />
              <Text style={styles.menuItemText}>View Forms</Text>
            </TouchableOpacity>

            <View style={styles.menuDivider} />

            <TouchableOpacity
              style={[styles.menuItem, styles.menuItemDelete]}
              onPress={handleDelete}
            >
              <Trash2 size={16} color="#ef4444" />
              <Text style={[styles.menuItemText, styles.menuItemDeleteText]}>
                Delete
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
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
    marginBottom: 16,
  },
  serviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 16,
  },
  serviceIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#f3e8ff',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceContent: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.black,
  },
  formStatusBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 48,
    flexDirection: 'row',
    alignItems: 'center',
  },
  formStatusCompleted: {
    backgroundColor: '#EBFAEF',
  },
  formStatusNotCompleted: {
    backgroundColor: '#FFF6E9',
  },
  formStatusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  formStatusTextCompleted: {
    color: '#34C759',
  },
  formStatusTextNotCompleted: {
    color: '#FF9500',
  },
  menuButton: {
    padding: 8,
    borderRadius: 8,
    alignSelf: 'center',
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
    color: colors.subtitleColor,
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
    color: colors.black,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  menuContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 10,
    minWidth: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  menuItemDelete: {
    backgroundColor: 'transparent',
  },
  menuItemText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.black,
  },
  menuItemDeleteText: {
    color: '#ef4444',
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 4,
  },
});

export default AppointmentCard;
