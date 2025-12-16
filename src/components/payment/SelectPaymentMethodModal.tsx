import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { X } from 'lucide-react-native';
import {
  createSubscription,
  listPaymentMethods,
  changeSubscriptionPlan,
} from '../../services/artistServices';
import AddCardModal from './AddCardModal';
// import Toast from 'react-native-toast-message';
import { useDispatch } from 'react-redux';
import { Card } from '../../types';
import {
  getSubscriptionFromStorage,
  refreshAuthUser,
  saveSubscriptionToStorage,
} from '../../utils/subscriptionStorage';

interface SelectPaymentMethodModalProps {
  visible: boolean;
  cards?: Card[];
  onClose: () => void;
  priceId?: string;
  onPaymentSuccess?: () => void;
  hasActiveSubscription?: boolean;
}

const SelectPaymentMethodModal: React.FC<SelectPaymentMethodModalProps> = ({
  visible,
  cards: initialCards = [],
  onClose,
  priceId,
  onPaymentSuccess,
  hasActiveSubscription = false,
}) => {
  const [cards, setCards] = useState<Card[]>(initialCards);
  const [selectedCard, setSelectedCard] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAddCard, setShowAddCard] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (initialCards.length === 0) {
      fetchPaymentMethods();
    } else {
      setCards(initialCards);
      const defaultCard = initialCards.find(c => c.isDefault);
      setSelectedCard(defaultCard?.id || initialCards[0]?.id || '');
    }
  }, [initialCards]);

  const fetchPaymentMethods = async () => {
    try {
      const response = await listPaymentMethods();
      const paymentMethods = response.data.data;

      const formattedCards: Card[] = paymentMethods.map((pm: any) => ({
        id: pm.id,
        name: pm.billing_details?.name || 'Card Holder',
        lastFour: pm.card?.last4 || '0000',
        brand: pm.card?.brand || 'visa',
        isDefault: pm.metadata?.isDefault === 'true',
        color: getCardColor(pm.card?.brand),
      }));

      setCards(formattedCards);
      const defaultCard = formattedCards.find(c => c.isDefault);
      setSelectedCard(defaultCard?.id || formattedCards[0]?.id || '');
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      setError('Failed to load payment methods');
    }
  };

  const getCardColor = (brand: string) => {
    const colors: { [key: string]: string } = {
      visa: '#1A1F71',
      mastercard: '#EB001B',
      amex: '#006FCF',
    };
    return colors[brand.toLowerCase()] || '#6B2A6B';
  };

  const handleMakePayment = async () => {
    if (!selectedCard) {
      setError('Please select a payment method');
      return;
    }

    if (!priceId) {
      setError('Price ID is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const subscriptionData = getSubscriptionFromStorage();
      const isSubscriptionActive =
        subscriptionData &&
        ['active', 'trialing'].includes(subscriptionData.status.toLowerCase());

      const shouldChangeSubscription =
        hasActiveSubscription || isSubscriptionActive;

      if (shouldChangeSubscription) {
        const response = await changeSubscriptionPlan(priceId, selectedCard);
        // Toast.show({
        //   type: 'success',
        //   text1: 'Subscription plan updated successfully!',
        // });

        if (response.data) {
          saveSubscriptionToStorage(response.data);
        }
      } else {
        const response = await createSubscription(priceId, selectedCard);
        // Toast.show({
        //   type: 'success',
        //   text1: 'Payment successful! Subscription activated.',
        // });

        if (response.data) {
          saveSubscriptionToStorage(response.data);
        }
      }

      await refreshAuthUser(dispatch);

      if (onPaymentSuccess) {
        onPaymentSuccess();
      }

      onClose();
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Payment failed. Please try again.';
      setError(errorMessage);
      Toast.show({
        type: 'error',
        text1: errorMessage,
      });
      console.error('Error making payment:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCardAdded = () => {
    fetchPaymentMethods();
    setShowAddCard(false);
  };

  if (showAddCard) {
    return (
      <AddCardModal
        visible={showAddCard}
        onClose={() => setShowAddCard(false)}
        onCardAdded={handleCardAdded}
      />
    );
  }

  const subscriptionData = getSubscriptionFromStorage();
  const isChangingPlan =
    hasActiveSubscription ||
    (subscriptionData &&
      ['active', 'trialing'].includes(subscriptionData.status.toLowerCase()));

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
            <Text style={styles.title}>Select a Payment Method</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={24} color="#1e293b" />
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitle}>
            {isChangingPlan
              ? 'Select card to update your subscription plan'
              : 'Select or add card to make payment'}
          </Text>

          {error !== '' && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.paymentSection}>
              <View style={styles.paymentHeader}>
                <Text style={styles.sectionTitle}>Select a Card</Text>
                <TouchableOpacity onPress={() => setShowAddCard(true)}>
                  <Text style={styles.addCardLink}>+ Add a Card</Text>
                </TouchableOpacity>
              </View>

              {cards.length === 0 ? (
                <View style={styles.noCardsContainer}>
                  <Text style={styles.noCardsText}>
                    No payment methods available. Please add a card.
                  </Text>
                  <TouchableOpacity
                    style={styles.addCardButton}
                    onPress={() => setShowAddCard(true)}
                  >
                    <Text style={styles.addCardButtonText}>Add a Card</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.cardsContainer}>
                  {cards.map(card => (
                    <TouchableOpacity
                      key={card.id}
                      style={[
                        styles.cardOption,
                        selectedCard === card.id && styles.cardOptionSelected,
                      ]}
                      onPress={() => setSelectedCard(card.id)}
                    >
                      <View
                        style={[
                          styles.cardVisual,
                          { backgroundColor: card.color },
                        ]}
                      >
                        <View style={styles.cardRadio}>
                          {selectedCard === card.id && (
                            <View style={styles.radioDot} />
                          )}
                        </View>
                        <View style={styles.cardInfo}>
                          <Text style={styles.cardName}>{card.name}</Text>
                          <Text style={styles.cardNumber}>
                            •••• •••• •••• {card.lastFour}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
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
                (loading || !selectedCard || cards.length === 0) &&
                  styles.confirmButtonDisabled,
              ]}
              onPress={handleMakePayment}
              disabled={loading || !selectedCard || cards.length === 0}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.confirmButtonText}>
                  {isChangingPlan ? 'Update Plan' : 'Make Payment'}
                </Text>
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
    color: '#1e293b',
    flex: 1,
  },
  closeButton: {
    padding: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
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
  paymentSection: {
    marginBottom: 16,
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  addCardLink: {
    color: '#8e2d8e',
    fontSize: 14,
    fontWeight: '500',
  },
  noCardsContainer: {
    alignItems: 'center',
    padding: 32,
  },
  noCardsText: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 16,
    textAlign: 'center',
  },
  addCardButton: {
    backgroundColor: '#8e2d8e',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  addCardButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  cardsContainer: {
    gap: 12,
  },
  cardOption: {
    marginBottom: 12,
  },
  cardOptionSelected: {
    transform: [{ scale: 1.02 }],
  },
  cardVisual: {
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'white',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  cardInfo: {
    flex: 1,
  },
  cardName: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardNumber: {
    color: 'white',
    fontSize: 14,
    opacity: 0.9,
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
    borderColor: '#e2e8f0',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#64748b',
    fontWeight: '500',
    fontSize: 16,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#8e2d8e',
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

export default SelectPaymentMethodModal;
