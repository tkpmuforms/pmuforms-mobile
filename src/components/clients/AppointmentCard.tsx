import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';
import {
  Calendar,
  Clock,
  FileText,
  MoreVertical,
  Trash2,
  CheckCircle,
  XCircle,
} from 'lucide-react-native';

import { formatAppointmentTime } from '../../utils/utils';
import { ClientAppointmentData } from '../../types';

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
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.serviceInfo}>
          <View style={styles.serviceIcon}>
            <Calendar size={20} color="#8e2d8e" />
          </View>
          <View style={styles.serviceContent}>
            <Text style={styles.serviceName} numberOfLines={1}>
              {serviceName}
            </Text>
          </View>
          <View style={styles.formStatus}>
            {appointment.allFormsCompleted ? (
              <CheckCircle size={20} color="#10B981" />
            ) : (
              <XCircle size={20} color="#F59E0B" />
            )}
          </View>
        </View>

        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setShowMenu(true)}
        >
          <MoreVertical size={16} color="#64748b" />
        </TouchableOpacity>
      </View>

      {/* Details */}
      <View style={styles.details}>
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <View style={styles.detailHeader}>
              <Calendar size={14} color="#64748b" />
              <Text style={styles.detailLabel}>Appointment Date</Text>
            </View>
            <Text style={styles.detailValue} numberOfLines={1}>
              {appointmentDate}
            </Text>
          </View>

          <View style={styles.detailItem}>
            <View style={styles.detailHeader}>
              <Clock size={14} color="#64748b" />
              <Text style={styles.detailLabel}>Form Filled</Text>
            </View>
            <Text style={styles.detailValue} numberOfLines={1}>
              {formFilledDate}
            </Text>
          </View>
        </View>
      </View>

      {/* Dropdown Menu Modal */}
      <Modal
        visible={showMenu}
        transparent
        animationType="fade"
        onRequestClose={handleMenuClose}
      >
        <Pressable style={styles.modalOverlay} onPress={handleMenuClose}>
          <View style={styles.menuContainer}>
            <TouchableOpacity style={styles.menuItem} onPress={handleViewForms}>
              <FileText size={16} color="#1e293b" />
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
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
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
    gap: 12,
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
    color: '#1e293b',
  },
  formStatus: {
    marginLeft: 8,
  },
  menuButton: {
    padding: 8,
    borderRadius: 8,
  },
  details: {
    marginTop: 8,
  },
  detailRow: {
    flexDirection: 'row',
    gap: 16,
  },
  detailItem: {
    flex: 1,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#1e293b',
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
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 8,
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
    color: '#1e293b',
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
