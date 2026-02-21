import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
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
import { colors } from '../../theme/colors';

const WEB_URL = 'https://artist.pmuforms.com';

const PaymentScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { user } = useAuth();
  console.log('User data in PaymentScreen:', user);

  const isMobileSub = user?.appStorePurchaseActive ?? false;

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
          ) : user?.stripeSubscriptionActive ? (
            <View style={styles.mobileSubContainer}>
              <Text style={styles.mobileSubText}>
                Your subscription is currently active.
              </Text>
              <Text style={styles.mobileSubText}>
                Billing and account management are handled through your PMUForms
                account.
              </Text>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
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
});

export default PaymentScreen;
