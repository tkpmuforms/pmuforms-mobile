import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  ChevronDown,
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { RootStackParamList } from '../../types/navigation';
import { createReminder } from '../../services/artistServices';

type AddReminderRouteProp = RouteProp<RootStackParamList, 'AddReminder'>;

const AddReminderScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<AddReminderRouteProp>();
  const { clientName, clientId } = route.params;

  const [note, setNote] = useState('');
  const [reminderType, setReminderType] = useState<'check-in' | 'follow-up'>(
    'check-in',
  );
  const [date, setDate] = useState(new Date(Date.now() + 24 * 60 * 60 * 1000));
  const [time, setTime] = useState(new Date(Date.now() + 24 * 60 * 60 * 1000));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showTypePicker, setShowTypePicker] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (note.trim() && clientId) {
      setIsSaving(true);

      // Combine date and time into a single ISO string
      const combinedDate = new Date(date);
      combinedDate.setHours(time.getHours(), time.getMinutes(), 0, 0);

      // Ensure the date is in the future
      if (combinedDate <= new Date()) {
        Toast.show({
          type: 'error',
          text1: 'Invalid Date',
          text2: 'Please select a future date and time',
        });
        setIsSaving(false);
        return;
      }

      try {
        await createReminder({
          customerId: clientId,
          sendAt: combinedDate.toISOString(),
          type: reminderType,
          note: note.trim(),
        });

        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Reminder set successfully',
        });
        navigation.goBack();
      } catch (error) {
        console.error('Error saving reminder:', error);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to set reminder',
        });
      } finally {
        setIsSaving(false);
      }
    }
  };

  const formatDate = (d: Date) => {
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (t: Date) => {
    return t.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.content}>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
              >
                <ArrowLeft size={24} color="#000000" />
              </TouchableOpacity>
              <View style={styles.headerText}>
                <Text style={styles.title}>Set Reminder</Text>
                <Text style={styles.subtitle}>
                  {clientName
                    ? `Set a reminder for ${clientName}`
                    : 'Set a reminder for this client'}
                </Text>
              </View>
            </View>

            {/* Form */}
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.formGroup}>
                <Text style={styles.label}>Type</Text>
                <TouchableOpacity
                  style={styles.pickerButton}
                  onPress={() => setShowTypePicker(!showTypePicker)}
                >
                  <Text style={styles.pickerButtonText}>
                    {reminderType === 'check-in' ? 'Check-in' : 'Follow-up'}
                  </Text>
                  <ChevronDown size={16} color="#64748b" />
                </TouchableOpacity>
                {showTypePicker && (
                  <View style={styles.typeOptions}>
                    <TouchableOpacity
                      style={[
                        styles.typeOption,
                        reminderType === 'check-in' &&
                          styles.typeOptionSelected,
                      ]}
                      onPress={() => {
                        setReminderType('check-in');
                        setShowTypePicker(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.typeOptionText,
                          reminderType === 'check-in' &&
                            styles.typeOptionTextSelected,
                        ]}
                      >
                        Check-in
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.typeOption,
                        reminderType === 'follow-up' &&
                          styles.typeOptionSelected,
                      ]}
                      onPress={() => {
                        setReminderType('follow-up');
                        setShowTypePicker(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.typeOptionText,
                          reminderType === 'follow-up' &&
                            styles.typeOptionTextSelected,
                        ]}
                      >
                        Follow-up
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Note</Text>
                <TextInput
                  style={styles.textArea}
                  value={note}
                  onChangeText={setNote}
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

            {/* Footer */}
            <View style={styles.footer}>
              <TouchableOpacity
                style={[
                  styles.saveButton,
                  (!note.trim() || isSaving) && styles.saveButtonDisabled,
                ]}
                onPress={handleSave}
                disabled={!note.trim() || isSaving}
              >
                {isSaving ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.saveButtonText}>Set Reminder</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    gap: 12,
  },
  backButton: {
    padding: 8,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
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
    backgroundColor: '#BCBBC133',
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
    backgroundColor: '#BCBBC133',
    gap: 8,
  },
  pickerButtonText: {
    fontSize: 14,
    color: '#000000',
    flex: 1,
  },
  typeOptions: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  typeOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  typeOptionSelected: {
    backgroundColor: '#F8F5F8',
  },
  typeOptionText: {
    fontSize: 14,
    color: '#64748b',
  },
  typeOptionTextSelected: {
    color: '#8e2d8e',
    fontWeight: '600',
  },
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  saveButton: {
    backgroundColor: '#8e2d8e',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#94a3b8',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddReminderScreen;
