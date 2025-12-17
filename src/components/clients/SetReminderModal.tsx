import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  Platform,
} from 'react-native';
import {
  X,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
} from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

interface SetReminderModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (reminderData: {
    date: string;
    time: string;
    message: string;
  }) => void;
  clientName?: string;
}

const SetReminderModal: React.FC<SetReminderModalProps> = ({
  visible,
  onClose,
  onSave,
  clientName,
}) => {
  const [message, setMessage] = useState('');
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleSave = () => {
    if (message.trim()) {
      const dateString = date.toISOString().split('T')[0];
      const timeString = time.toTimeString().split(' ')[0].substring(0, 5);

      onSave({
        date: dateString,
        time: timeString,
        message: message.trim(),
      });
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (time: Date) => {
    return time.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={20} color="#64748b" />
            </TouchableOpacity>

            <View style={styles.header}>
              <Text style={styles.title}>Set Reminder</Text>
              <Text style={styles.subtitle}>
                {clientName
                  ? `Set a reminder for ${clientName}`
                  : 'Set a reminder for this client'}
              </Text>
            </View>

            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.formGroup}>
                <Text style={styles.label}>Message</Text>
                <TextInput
                  style={styles.textArea}
                  value={message}
                  onChangeText={setMessage}
                  placeholder="What do you want to be reminded about?"
                  placeholderTextColor="#94a3b8"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>

              <View style={styles.formRow}>
                <View style={styles.formGroupHalf}>
                  <Text style={styles.label}>Date</Text>
                  <TouchableOpacity
                    style={styles.pickerButton}
                    onPress={() => setShowDatePicker(true)}
                  >
                    <CalendarIcon size={16} color="#64748b" />
                    <Text style={styles.pickerButtonText}>
                      {formatDate(date)}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.formGroupHalf}>
                  <Text style={styles.label}>Time</Text>
                  <TouchableOpacity
                    style={styles.pickerButton}
                    onPress={() => setShowTimePicker(true)}
                  >
                    <ClockIcon size={16} color="#64748b" />
                    <Text style={styles.pickerButtonText}>
                      {formatTime(time)}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {showDatePicker && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={(event, selectedDate) => {
                    setShowDatePicker(Platform.OS === 'ios');
                    if (selectedDate) {
                      setDate(selectedDate);
                    }
                  }}
                  minimumDate={new Date()}
                />
              )}

              {showTimePicker && (
                <DateTimePicker
                  value={time}
                  mode="time"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={(event, selectedTime) => {
                    setShowTimePicker(Platform.OS === 'ios');
                    if (selectedTime) {
                      setTime(selectedTime);
                    }
                  }}
                />
              )}
            </ScrollView>

            <TouchableOpacity
              style={[
                styles.submitButton,
                !message.trim() && styles.submitButtonDisabled,
              ]}
              onPress={handleSave}
              disabled={!message.trim()}
            >
              <Text style={styles.submitButtonText}>Set Reminder</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    maxHeight: '90%',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 8,
    borderRadius: 8,
    zIndex: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
  scrollView: {
    maxHeight: 400,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  formGroupHalf: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  textArea: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    fontSize: 14,
    color: '#000000',
    backgroundColor: '#f8fafc',
    minHeight: 100,
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    gap: 8,
  },
  pickerButtonText: {
    fontSize: 14,
    color: '#000000',
    flex: 1,
  },
  submitButton: {
    backgroundColor: '#8e2d8e',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonDisabled: {
    backgroundColor: '#94a3b8',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SetReminderModal;
