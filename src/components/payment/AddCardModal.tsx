import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { X } from 'lucide-react-native';
import { colors } from '../../theme/colors';

interface AddCardModalProps {
  visible: boolean;
  onClose: () => void;
  onCardAdded: () => void;
}

const AddCardModal: React.FC<AddCardModalProps> = ({
  visible,
  onClose,
  onCardAdded,
}) => {
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAddCard = async () => {
    if (!cardNumber || !cardHolder || !expiryDate || !cvv) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // TODO: Implement card addition logic here

      await new Promise<void>(resolve => setTimeout(() => resolve(), 1000));

      onCardAdded();
    } catch (err: any) {
      const errorMessage =
        err.message || 'Failed to add card. Please try again.';
      setError(errorMessage);
      console.error('Error adding card:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\s/g, '');
    const matches = cleaned.match(/.{1,4}/g);
    return matches ? matches.join(' ') : cleaned;
  };

  const formatExpiryDate = (text: string) => {
    const cleaned = text.replace(/\//g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

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
          <View style={styles.header}>
            <Text style={styles.title}>Add New Card</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={24} color={colors.black} />
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitle}>Enter your card details</Text>

          {error !== '' && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Card Number</Text>
              <TextInput
                style={styles.input}
                value={cardNumber}
                onChangeText={text => {
                  const cleaned = text.replace(/\s/g, '');
                  if (cleaned.length <= 16) {
                    setCardNumber(formatCardNumber(cleaned));
                  }
                }}
                placeholder="1234 5678 9012 3456"
                placeholderTextColor="#9ca3af"
                keyboardType="number-pad"
                maxLength={19}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Card Holder Name</Text>
              <TextInput
                style={styles.input}
                value={cardHolder}
                onChangeText={setCardHolder}
                placeholder="John Doe"
                placeholderTextColor="#9ca3af"
                autoCapitalize="words"
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.formGroup, styles.halfWidth]}>
                <Text style={styles.label}>Expiry Date</Text>
                <TextInput
                  style={styles.input}
                  value={expiryDate}
                  onChangeText={text => {
                    const cleaned = text.replace(/\//g, '');
                    if (cleaned.length <= 4) {
                      setExpiryDate(formatExpiryDate(cleaned));
                    }
                  }}
                  placeholder="MM/YY"
                  placeholderTextColor="#9ca3af"
                  keyboardType="number-pad"
                  maxLength={5}
                />
              </View>

              <View style={[styles.formGroup, styles.halfWidth]}>
                <Text style={styles.label}>CVV</Text>
                <TextInput
                  style={styles.input}
                  value={cvv}
                  onChangeText={text => {
                    if (text.length <= 4) {
                      setCvv(text);
                    }
                  }}
                  placeholder="123"
                  placeholderTextColor="#9ca3af"
                  keyboardType="number-pad"
                  maxLength={4}
                  secureTextEntry
                />
              </View>
            </View>
          </ScrollView>

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.confirmButton,
                loading && styles.confirmButtonDisabled,
              ]}
              onPress={handleAddCard}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.confirmButtonText}>Add Card</Text>
              )}
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
    padding: 24,
    width: '90%',
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.black,
    flex: 1,
  },
  closeButton: {
    padding: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.subtitleColor,
    marginBottom: 16,
  },
  errorContainer: {
    backgroundColor: '#fee2e2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 14,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    fontSize: 16,
    color: colors.black,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.borderColor,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: colors.subtitleColor,
    fontWeight: '500',
    fontSize: 16,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: colors.primary,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmButtonDisabled: {
    opacity: 0.5,
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default AddCardModal;
