import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Pressable,
} from 'react-native';
import { X } from 'lucide-react-native';
import SelectPaymentMethodModal from '../payment/SelectPaymentMethodModal';
import { Config } from 'react-native-config';

interface SubscriptionModalProps {
  visible: boolean;
  onClose: () => void;
  onShowFeatures?: () => void;
  onSubscribe?: () => void;
  currentPriceId?: string;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  visible,
  onClose,
  onShowFeatures,
  onSubscribe,
  currentPriceId,
}) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPriceId, setSelectedPriceId] = useState<string>('');

  const weeklyPrice = Number(Config.WEEKLY_PRICE || '0');
  const monthlyPrice = Number(Config.MONTHLY_PRICE || '0');
  const yearlyPrice = Number(Config.YEARLY_PRICE || '0');

  const monthlyPricePerWeek = monthlyPrice / 4.33;
  const yearlyPricePerWeek = yearlyPrice / 52;

  const monthlyDiscount =
    ((weeklyPrice * 4.33 - monthlyPrice) / (weeklyPrice * 4.33)) * 100;
  const yearlyDiscount =
    ((weeklyPrice * 52 - yearlyPrice) / (weeklyPrice * 52)) * 100;

  const pricingPlans = [
    {
      name: 'WEEKLY',
      price: `$${weeklyPrice}`,
      period: 'week',
      subtitle: 'Basic access',
      badge: '',
      popular: false,
      priceId: Config.WEEKLY_PRICE_ID || '',
    },
    {
      name: 'MONTHLY',
      price: `$${monthlyPrice}`,
      period: 'month',
      subtitle: `(only $${monthlyPricePerWeek.toFixed(2)} / week)`,
      badge: `-${Math.round(monthlyDiscount)}%`,
      popular: false,
      priceId: Config.MONTHLY_PRICE_ID || '',
    },
    {
      name: 'YEARLY',
      price: `$${yearlyPrice}`,
      period: 'year',
      subtitle: `(only $${yearlyPricePerWeek.toFixed(2)} / week)`,
      badge: `-${Math.round(yearlyDiscount)}%`,
      popular: true,
      priceId: Config.YEARLY_PRICE_ID || '',
    },
  ];

  const handleSubscribeClick = (priceId: string) => {
    setSelectedPriceId(priceId);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    if (onSubscribe) {
      onSubscribe();
    }
    onClose();
  };

  const isCurrentPlan = (priceId: string) => {
    return currentPriceId === priceId;
  };

  return (
    <>
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={onClose}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={styles.backdrop} onPress={onClose} />
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={20} color="#64748b" />
            </TouchableOpacity>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.header}>
                <View style={styles.logoContainer}>
                  <View style={styles.logo}>
                    <Text style={styles.logoText}>PMU{'\n'}Forms</Text>
                  </View>
                </View>
                <Text style={styles.title}>
                  {currentPriceId
                    ? 'Change Your PMU Subscription'
                    : 'Reactivate your PMU Subscription'}
                </Text>
                <Text style={styles.subtitle}>
                  {currentPriceId
                    ? 'Select a new plan to switch your subscription'
                    : 'Subscribe to unlock and keep enjoying the ultimate experience on PMU Forms'}
                </Text>
              </View>

              <View style={styles.pricingSection}>
                <Text style={styles.sectionTitle}>SELECT YOUR PLAN</Text>
                {pricingPlans.map((plan, index) => {
                  const isCurrent = isCurrentPlan(plan.priceId);
                  const isPopular = plan.popular && !currentPriceId;

                  return (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.pricingPlan,
                        (isPopular || isCurrent) && styles.pricingPlanPopular,
                      ]}
                      onPress={() =>
                        !isCurrent && handleSubscribeClick(plan.priceId)
                      }
                      disabled={isCurrent}
                      activeOpacity={isCurrent ? 1 : 0.7}
                    >
                      {plan.badge !== '' && (
                        <View style={styles.badge}>
                          <Text style={styles.badgeText}>{plan.badge}</Text>
                        </View>
                      )}
                      {isPopular && (
                        <View style={styles.popularLabel}>
                          <Text style={styles.popularLabelText}>
                            Best Value
                          </Text>
                        </View>
                      )}
                      {isCurrent && (
                        <View style={styles.currentLabel}>
                          <Text style={styles.currentLabelText}>
                            Current Plan
                          </Text>
                        </View>
                      )}
                      <Text style={styles.planName}>{plan.name}</Text>
                      <View style={styles.priceContainer}>
                        <Text style={styles.priceAmount}>{plan.price}</Text>
                        <Text style={styles.pricePeriod}>/ {plan.period}</Text>
                      </View>
                      <Text style={styles.planSubtitle}>{plan.subtitle}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.restoreButton}
                  onPress={onShowFeatures}
                >
                  <Text style={styles.restoreButtonText}>
                    Restore Purchases
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {showPaymentModal && (
        <SelectPaymentMethodModal
          visible={showPaymentModal}
          cards={[]}
          onClose={() => setShowPaymentModal(false)}
          priceId={selectedPriceId}
          onPaymentSuccess={handlePaymentSuccess}
          hasActiveSubscription={!!currentPriceId}
        />
      )}
    </>
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
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 40,
    width: '100%',
    maxHeight: '90%',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'transparent',
    zIndex: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    marginBottom: 16,
  },
  logo: {
    backgroundColor: '#8e2d8e',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  logoText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 18,
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1e293b',
    marginVertical: 16,
    textAlign: 'center',
  },
  subtitle: {
    color: '#64748b',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  pricingSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 20,
    letterSpacing: 0.5,
  },
  pricingPlan: {
    position: 'relative',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  pricingPlanPopular: {
    borderColor: '#8e2d8e',
    backgroundColor: '#faf5ff',
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: 16,
    backgroundColor: '#8e2d8e',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  popularLabel: {
    position: 'absolute',
    top: -8,
    left: 16,
    backgroundColor: '#8e2d8e',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  popularLabelText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  currentLabel: {
    position: 'absolute',
    top: -8,
    left: 16,
    backgroundColor: '#8e2d8e',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  currentLabelText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  planName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  priceAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
  },
  pricePeriod: {
    fontSize: 16,
    color: '#64748b',
    marginLeft: 4,
  },
  planSubtitle: {
    fontSize: 14,
    color: '#64748b',
  },
  actions: {
    marginTop: 16,
  },
  restoreButton: {
    width: '100%',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  restoreButtonText: {
    color: '#64748b',
    fontWeight: '500',
    fontSize: 16,
  },
});

export default SubscriptionModal;
