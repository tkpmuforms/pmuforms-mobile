import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { CreditCard, Plus } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { colors } from '../../theme/colors';
import useAuth from '../../hooks/useAuth';
import ScreenHeader from '../../components/layout/ScreenHeader';
import {
  cancelSubscription,
  detachPaymentMethod,
  getSubscription,
  listPaymentMethods,
  listTransactions,
} from '../../services/artistServices';
import { getCardColor, getTransactionStatus } from '../../utils/utils';

interface Card {
  id: string;
  name: string;
  lastFour: string;
  brand: 'mastercard' | 'visa' | 'amex' | 'unionpay';
  isDefault: boolean;
  color: string;
}

interface SubscriptionHistory {
  date: string;
  description: string;
  cardUsed: string;
  amount: number;
  status: string;
}

interface SubscriptionData {
  status: string;
  interval: string;
  intervalCount: number;
  currentPeriodEnd: number;
  cancelAt?: number;
  priceId?: string;
}

const PaymentScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const defaultCardId = user?.defaultStripePaymentMethod || '';

  const [cards, setCards] = useState<Card[]>([]);
  const [subscriptionHistory, setSubscriptionHistory] = useState<
    SubscriptionHistory[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [subscriptionData, setSubscriptionData] =
    useState<SubscriptionData | null>(null);

  useEffect(() => {
    fetchPaymentMethods();
    fetchTransactionHistory();
    fetchSubscriptionData();
  }, []);

  const fetchSubscriptionData = async () => {
    try {
      const response = await getSubscription();
      setSubscriptionData(response.data);
    } catch (error) {
      console.error('Error fetching subscription:', error);
    }
  };

  const fetchPaymentMethods = async () => {
    try {
      const response = await listPaymentMethods();
      const paymentMethods = response.data.data || response.data;

      const formattedCards: Card[] = paymentMethods.map((pm: any) => ({
        id: pm.id,
        name: pm.billing_details?.name || 'Card Holder',
        lastFour: pm.card?.last4 || '0000',
        brand: pm.card?.brand || 'visa',
        isDefault: pm.id === defaultCardId,
        color: getCardColor(pm.card?.brand || 'visa'),
      }));

      setCards(formattedCards);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
    }
  };

  const fetchTransactionHistory = async () => {
    try {
      setLoading(true);

      const response = await listTransactions();
      const invoices = response.data?.invoices || response.data;

      const formattedHistory: SubscriptionHistory[] = invoices.map(
        (invoice: any) => ({
          date: new Date(invoice.created).toLocaleDateString(),
          description: invoice.description || 'Subscription Payment',
          cardUsed: `•••• •••• •••• ${
            invoice.payment_method_details?.card?.last4 || '0000'
          }`,
          amount: invoice.amount,
          status: getTransactionStatus(invoice.status),
        }),
      );

      setSubscriptionHistory(formattedHistory);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = () => {
    Alert.alert(
      'Cancel Subscription',
      'Are you sure you want to cancel your subscription?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            try {
              await cancelSubscription();

              Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Subscription cancelled successfully',
              });
              fetchTransactionHistory();
              fetchSubscriptionData();
            } catch (error) {
              console.error('Error cancelling subscription:', error);
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to cancel subscription',
              });
            }
          },
        },
      ],
    );
  };

  const handleDeleteCard = (cardId: string, cardLast4: string) => {
    Alert.alert(
      'Delete Card',
      `Are you sure you want to delete card ending in ${cardLast4}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await detachPaymentMethod(cardId);

              await fetchPaymentMethods();
              Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Card deleted successfully',
              });
            } catch (error) {
              console.error('Error deleting card:', error);
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to delete card',
              });
            }
          },
        },
      ],
    );
  };

  const getPlanName = (interval: string, count: number) => {
    if (interval === 'month' && count === 1) return 'Monthly Plan';
    if (interval === 'year' && count === 1) return 'Annual Plan';
    return 'Custom Plan';
  };

  const isSubscriptionActive = (status: string) => {
    return status === 'active' || status === 'trialing';
  };

  const formatNextBillingDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const isMobileSub = user?.appStorePurchaseActive ?? false;
  const isActive = isMobileSub
    ? true
    : subscriptionData
    ? isSubscriptionActive(subscriptionData.status)
    : user?.stripeSubscriptionActive;

  const currentPlan = isMobileSub
    ? 'Mobile Subscription'
    : subscriptionData
    ? getPlanName(subscriptionData.interval, subscriptionData.intervalCount)
    : 'No Active Plan';

  const isCancelled = !isMobileSub && !!subscriptionData?.cancelAt;
  const billingDateLabel = isCancelled
    ? 'Subscription Ends'
    : 'Next Billing Date';
  const billingDateValue = isMobileSub
    ? '—'
    : isCancelled && subscriptionData?.cancelAt
    ? formatNextBillingDate(subscriptionData.cancelAt)
    : subscriptionData?.currentPeriodEnd
    ? formatNextBillingDate(subscriptionData.currentPeriodEnd)
    : 'N/A';

  const renderCard = (card: Card) => (
    <TouchableOpacity
      key={card.id}
      style={[styles.card, { backgroundColor: card.color }]}
      onLongPress={() => handleDeleteCard(card.id, card.lastFour)}
    >
      {card.isDefault && (
        <View style={styles.cardBadge}>
          <Text style={styles.cardBadgeText}>• Default Card</Text>
        </View>
      )}
      <View style={styles.cardContent}>
        <CreditCard size={40} color={colors.white} />
      </View>
      <View style={styles.cardFooter}>
        <View>
          <Text style={styles.cardName}>{card.name}</Text>
          <Text style={styles.cardNumber}>•••• •••• •••• {card.lastFour}</Text>
        </View>
        <TouchableOpacity
          onPress={() => handleDeleteCard(card.id, card.lastFour)}
        >
          <Text style={styles.cardMenu}>⋮</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      <ScreenHeader
        title="Payment & Billing"
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Subscription</Text>

          {isMobileSub ? (
            <View style={styles.mobileSubContainer}>
              <Text style={styles.mobileSubTitle}>
                You already have an active mobile subscription.
              </Text>
              <Text style={styles.mobileSubText}>
                Your current plan is still valid and managed through the mobile
                app.
              </Text>
              <Text style={styles.mobileSubText}>
                When it expires, you'll be able to switch to a web subscription
                directly from this site.
              </Text>
            </View>
          ) : (
            <View style={styles.subscriptionInfo}>
              <View style={styles.subscriptionRow}>
                <Text style={styles.label}>Current Plan</Text>
                <Text style={styles.value}>{currentPlan}</Text>
              </View>
              <View style={styles.subscriptionRow}>
                <Text style={styles.label}>{billingDateLabel}</Text>
                <Text style={styles.value}>{billingDateValue}</Text>
              </View>
              <View style={styles.subscriptionRow}>
                <Text style={styles.label}>Status</Text>
                <View
                  style={[
                    styles.statusBadge,
                    isActive ? styles.statusActive : styles.statusInactive,
                  ]}
                >
                  <Text style={styles.statusText}>
                    {isActive ? 'Active' : 'Inactive'}
                  </Text>
                </View>
              </View>

              <View style={styles.subscriptionActions}>
                {isActive && !isCancelled && (
                  <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={handleCancelSubscription}
                  >
                    <Text style={styles.secondaryButtonText}>
                      Cancel Subscription
                    </Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity style={styles.primaryButton}>
                  <Text style={styles.primaryButtonText}>
                    {isActive ? 'Change Plan' : 'Upgrade Subscription'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* Cards Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Cards</Text>
            <TouchableOpacity>
              <Text style={styles.addCardLink}>+ Add a Card</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.cardsGrid}>
            {cards.map(renderCard)}

            <TouchableOpacity style={styles.addCardButton}>
              <Plus size={32} color={colors.textLight} />
              <Text style={styles.addCardText}>Add a Card</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Transaction History */}
        {!isMobileSub && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Payment & Subscription History
            </Text>

            {loading ? (
              <ActivityIndicator size="large" color={colors.primary} />
            ) : subscriptionHistory.length > 0 ? (
              <View style={styles.historyList}>
                {subscriptionHistory.map((item, index) => (
                  <View key={index} style={styles.historyItem}>
                    <View style={styles.historyRow}>
                      <Text style={styles.historyLabel}>Date</Text>
                      <Text style={styles.historyValue}>{item.date}</Text>
                    </View>
                    <View style={styles.historyRow}>
                      <Text style={styles.historyLabel}>Description</Text>
                      <Text style={styles.historyValue}>
                        {item.description}
                      </Text>
                    </View>
                    <View style={styles.historyRow}>
                      <Text style={styles.historyLabel}>Card Used</Text>
                      <Text style={styles.historyValue}>{item.cardUsed}</Text>
                    </View>
                    <View style={styles.historyRow}>
                      <Text style={styles.historyLabel}>Amount</Text>
                      <Text style={styles.historyValue}>${item.amount}</Text>
                    </View>
                    <View style={styles.historyRow}>
                      <Text style={styles.historyLabel}>Status</Text>
                      <Text style={[styles.historyValue, styles.statusText]}>
                        • {item.status}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.emptyText}>No transaction history</Text>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  section: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  addCardLink: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  mobileSubContainer: {
    gap: 12,
  },
  mobileSubTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  mobileSubText: {
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 20,
  },
  subscriptionInfo: {
    gap: 16,
  },
  subscriptionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    color: colors.textLight,
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusActive: {
    backgroundColor: '#D1FAE5',
  },
  statusInactive: {
    backgroundColor: '#FEE2E2',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  subscriptionActions: {
    gap: 12,
    marginTop: 8,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: colors.background,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  cardsGrid: {
    gap: 16,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    height: 180,
  },
  cardBadge: {
    marginBottom: 8,
  },
  cardBadgeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardName: {
    color: colors.white,
    fontSize: 14,
    marginBottom: 4,
  },
  cardNumber: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  cardMenu: {
    color: colors.white,
    fontSize: 24,
    fontWeight: 'bold',
  },
  addCardButton: {
    borderRadius: 12,
    padding: 16,
    height: 180,
    backgroundColor: colors.background,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  addCardText: {
    fontSize: 16,
    color: colors.textLight,
  },
  historyList: {
    gap: 12,
  },
  historyItem: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    gap: 8,
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  historyLabel: {
    fontSize: 13,
    color: colors.textLight,
  },
  historyValue: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    paddingVertical: 20,
  },
});

export default PaymentScreen;
