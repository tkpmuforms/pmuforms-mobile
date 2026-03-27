import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../../components/layout/ScreenHeader';
import useAuth from '../../hooks/useAuth';
import { getSubscription } from '../../services/artistServices';
import { colors } from '../../theme/colors';
import { SubscriptionData } from '../../types';

const WEB_URL = 'https://artist.pmuforms.com';

const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const PaymentScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { user } = useAuth();
  const [subscriptionData, setSubscriptionData] =
    useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(false);

  const isMobileSub = user?.appStorePurchaseActive ?? false;
  const isStripeSub = user?.stripeSubscriptionActive ?? false;

  useEffect(() => {
    if (!isMobileSub && isStripeSub) {
      setLoading(true);
      getSubscription()
        .then(response => {
          const sub = response?.data;
          if (sub) {
            setSubscriptionData({
              id: sub.id,
              status: sub.status,
              currentPeriodEnd:
                sub.items?.data?.[0]?.current_period_end ||
                sub.current_period_end,
              currentPeriodStart:
                sub.items?.data?.[0]?.current_period_start ||
                sub.current_period_start,
              priceId:
                sub.items?.data?.[0]?.price?.id || sub.plan?.id,
              interval:
                sub.items?.data?.[0]?.price?.recurring?.interval ||
                sub.plan?.interval,
              intervalCount:
                sub.items?.data?.[0]?.price?.recurring?.interval_count ||
                sub.plan?.interval_count ||
                1,
              amount:
                sub.items?.data?.[0]?.price?.unit_amount || sub.plan?.amount,
              currency:
                sub.items?.data?.[0]?.price?.currency || sub.currency,
              cancelAt: sub.cancel_at,
            });
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [isMobileSub, isStripeSub]);

  const isCancelled = !isMobileSub && !!subscriptionData?.cancelAt;
  const billingDateLabel = isCancelled ? 'Subscription Ends' : 'Next Billing Date';
  const billingDateValue = isCancelled
    ? formatDate(subscriptionData!.cancelAt!)
    : subscriptionData?.currentPeriodEnd
    ? formatDate(subscriptionData.currentPeriodEnd)
    : null;

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
          {isMobileSub ? (
            <View style={styles.mobileSubContainer}>
              <Text style={styles.mobileSubTitle}>Active Subscription</Text>
              <Text style={styles.mobileSubText}>
                You currently have an active mobile subscription.
              </Text>
              <Text style={styles.mobileSubText}>
                Your access will continue until the end of your current billing
                period.
              </Text>
              <Text style={styles.mobileSubText}>
                After that, you can manage your account at
              </Text>
              <TouchableOpacity onPress={() => Linking.openURL(WEB_URL)}>
                <Text style={styles.webLinkText}>artist.pmuforms.com</Text>
              </TouchableOpacity>
            </View>
          ) : isStripeSub ? (
            <View style={styles.mobileSubContainer}>
              <Text style={styles.mobileSubTitle}>Active Subscription</Text>
              {loading ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : billingDateValue ? (
                <View style={styles.billingRow}>
                  <Text style={styles.billingLabel}>{billingDateLabel}</Text>
                  <Text style={styles.billingValue}>{billingDateValue}</Text>
                </View>
              ) : null}
              <Text style={styles.mobileSubText}>
                To view or update your subscription, please visit
              </Text>
              <TouchableOpacity onPress={() => Linking.openURL(WEB_URL)}>
                <Text style={styles.webLinkText}>artist.pmuforms.com</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.mobileSubContainer}>
              <Text style={styles.inactiveSubTitle}>InActive</Text>
              <Text style={styles.mobileSubText}>
                To access all features, please sign in at
              </Text>
              <TouchableOpacity onPress={() => Linking.openURL(WEB_URL)}>
                <Text style={styles.webLinkText}>artist.pmuforms.com</Text>
              </TouchableOpacity>
              <Text style={styles.mobileSubText}>
                to manage your account and subscription.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
  mobileSubContainer: {
    gap: 12,
  },
  mobileSubTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  inactiveSubTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF0000',
  },
  mobileSubText: {
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 20,
  },
  webLinkText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    lineHeight: 20,
    textDecorationLine: 'underline',
  },
  billingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  billingLabel: {
    fontSize: 14,
    color: colors.textLight,
  },
  billingValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
});

export default PaymentScreen;
