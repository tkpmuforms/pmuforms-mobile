import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Check } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

// Pricing constants
const weeklyPrice = 19.99;
const monthlyPrice = 99.99;
const yearlyPrice = 199.99;
const monthlyPricePerWeek = monthlyPrice / 4.33;
const yearlyPricePerWeek = yearlyPrice / 52;

interface PaymentSetupScreenProps {
  navigation: any;
}

const PaymentSetupScreen: React.FC<PaymentSetupScreenProps> = ({
  navigation,
}) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>(
    'monthly',
  );

  const hasActiveSubscription =
    user?.stripeSubscriptionActive || user?.appStorePurchaseActive;

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSkip = () => {
    // Navigate to main app
    navigation.reset({
      index: 0,
      routes: [{ name: 'Main' }],
    });
  };

  const handleSubscribe = () => {
    // Navigate to payment screen
    navigation.reset({
      index: 0,
      routes: [
        { name: 'Main' },
        {
          name: 'Payment',
        },
      ],
    });
  };

  const pricingPlans = [
    {
      id: '1-month',
      name: '1 MONTH',
      price: `$${weeklyPrice}`,
      period: 'month',
      subtitle: '(7days free trial)',
      badge: '',
      popular: false,
      freeTrialLabel: '7-day free trial',
      specialOffer: false,
    },
    {
      id: '6-months',
      name: '6 MONTHS',
      price: `$${monthlyPrice}`,
      period: 'month',
      subtitle: `(only $${monthlyPricePerWeek.toFixed(2)} / month)`,
      badge: '-5%',
      popular: false,
      freeTrialLabel: '7-day free trial',
      specialOffer: false,
    },
    {
      id: '12-months',
      name: '12 MONTHS',
      price: `$${yearlyPrice}`,
      period: 'year',
      subtitle: `(only $${yearlyPricePerWeek.toFixed(2)} / month)`,
      badge: '-5%',
      popular: false,
      freeTrialLabel: '7-day free trial',
      specialOffer: true,
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ChevronLeft size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={styles.progressFill} />
          </View>
          <Text style={styles.progressText}>Step 3 of 3</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerContent}>
          <Text style={styles.title}>
            {hasActiveSubscription ? "You're All Set!" : 'Choose Your Plan'}
          </Text>
          <Text style={styles.subtitle}>
            {hasActiveSubscription
              ? 'You have an active subscription. Continue to your dashboard.'
              : 'Unlock all features and grow your business'}
          </Text>
        </View>

        {!hasActiveSubscription && (
          <>
            {/* Plans */}
            <View style={styles.plansContainer}>
              {pricingPlans.map(plan => {
                const isSelected = selectedPlan === plan.id;
                return (
                  <TouchableOpacity
                    key={plan.id}
                    style={[
                      styles.planCard,
                      isSelected && styles.planCardSelected,
                      plan.specialOffer && styles.planCardSpecialOffer,
                    ]}
                    onPress={() =>
                      setSelectedPlan(plan.id as 'monthly' | 'yearly')
                    }
                    activeOpacity={0.7}
                  >
                    {plan.badge && (
                      <View style={styles.savingsBadge}>
                        <Text style={styles.savingsText}>{plan.badge}</Text>
                      </View>
                    )}

                    <View style={styles.planHeader}>
                      <View style={styles.planInfo}>
                        <Text style={styles.planName}>{plan.name}</Text>
                        <View style={styles.priceContainer}>
                          <Text style={styles.planPrice}>{plan.price}</Text>
                          <Text style={styles.planPeriod}>/{plan.period}</Text>
                        </View>
                        {plan.subtitle && (
                          <Text style={styles.planSubtitle}>
                            {plan.subtitle}
                          </Text>
                        )}
                      </View>
                      {isSelected && (
                        <View style={styles.selectedIcon}>
                          <Check size={20} color={colors.white} />
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Info */}
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                ✨ Start with a 7-day free trial. Cancel anytime.
              </Text>
            </View>
          </>
        )}
      </ScrollView>

      {/* Footer Buttons */}
      <View style={styles.footer}>
        {hasActiveSubscription ? (
          <TouchableOpacity style={styles.button} onPress={handleSkip}>
            <Text style={styles.buttonText}>Go to Dashboard</Text>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity style={styles.button} onPress={handleSubscribe}>
              <Text style={styles.buttonText}>Subscribe Now</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.skipButton}
              onPress={handleSkip}
              activeOpacity={0.7}
            >
              <Text style={styles.skipButtonText}>Skip for now</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 8,
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  progressContainer: {
    flex: 1,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.borderColor,
    borderRadius: 2,
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
    width: '100%',
  },
  progressText: {
    fontSize: 12,
    color: colors.subtitleColor,
    textAlign: 'center',
  },
  headerContent: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.subtitleColor,
    lineHeight: 24,
  },
  plansContainer: {
    gap: 16,
  },
  planCard: {
    borderWidth: 2,
    borderColor: colors.borderColor,
    borderRadius: 16,
    padding: 20,
    backgroundColor: colors.white,
    position: 'relative',
  },
  planCardSelected: {
    borderColor: colors.primary,
    backgroundColor: '#f9fafb',
  },
  planCardSpecialOffer: {
    borderColor: colors.primary,
  },
  savingsBadge: {
    position: 'absolute',
    top: -10,
    right: 20,
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  savingsText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  planInfo: {
    flex: 1,
  },
  planName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  planPrice: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.primary,
  },
  planPeriod: {
    fontSize: 16,
    color: colors.subtitleColor,
    marginLeft: 4,
  },
  planSubtitle: {
    fontSize: 12,
    color: colors.subtitleColor,
    marginTop: 4,
  },
  selectedIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoBox: {
    backgroundColor: '#f0f9ff',
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
    marginBottom: 16,
  },
  infoText: {
    fontSize: 14,
    color: '#0369a1',
    lineHeight: 20,
    textAlign: 'center',
  },
  footer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: colors.borderColor,
    backgroundColor: colors.white,
    gap: 12,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  skipButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  skipButtonText: {
    color: colors.subtitleColor,
    fontSize: 14,
    fontWeight: '500',
  },
});

export default PaymentSetupScreen;
