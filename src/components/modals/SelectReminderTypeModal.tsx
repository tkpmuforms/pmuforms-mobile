import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from 'react-native';
import { X, Calendar, Bell, ChevronRight } from 'lucide-react-native';
import { colors } from '../../theme/colors';

interface SelectReminderTypeModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectType: (type: 'check-in' | 'follow-up') => void;
}

const SelectReminderTypeModal: React.FC<SelectReminderTypeModalProps> = ({
  visible,
  onClose,
  onSelectType,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={20} color={colors.subtitleColor} />
          </TouchableOpacity>

          <Text style={styles.title}>Select Reminder Type</Text>

          <View style={styles.reminderTypes}>
            <TouchableOpacity
              style={styles.reminderTypeCard}
              onPress={() => onSelectType('check-in')}
              activeOpacity={0.7}
            >
              <View style={[styles.iconContainer, styles.checkInIcon]}>
                <Calendar size={24} color="white" />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>Check In</Text>
                <Text style={styles.cardDescription}>
                  Receive a reminder as a notification in the future when this
                  client will check in
                </Text>
              </View>
              <ChevronRight size={24} color={colors.subtitleColor} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.reminderTypeCard}
              onPress={() => onSelectType('follow-up')}
              activeOpacity={0.7}
            >
              <View style={[styles.iconContainer, styles.followUpIcon]}>
                <Bell size={24} color="white" />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>Follow-Up</Text>
                <Text style={styles.cardDescription}>
                  Receive a reminder as a notification in the future to follow
                  up on this client
                </Text>
              </View>
              <ChevronRight size={24} color={colors.subtitleColor} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 40,
    width: '90%',
    maxWidth: 500,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    padding: 8,
    borderRadius: 8,
    zIndex: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.black,
    marginBottom: 24,
  },
  reminderTypes: {
    gap: 16,
  },
  reminderTypeCard: {
    flexDirection: 'row',
    alignItems: 'center',

    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  checkInIcon: {
    backgroundColor: '#dbeafe',
  },
  followUpIcon: {
    backgroundColor: '#fef3c7',
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.black,
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: colors.subtitleColor,
    lineHeight: 20,
  },
});

export default SelectReminderTypeModal;
