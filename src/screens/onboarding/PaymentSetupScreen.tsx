import React, { useEffect, useRef } from 'react';
import {
  AppState,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { refreshAuthUser } from '../../utils/authUtils';
import useAuth from '../../hooks/useAuth';

const WEB_URL = 'https://artist.pmuforms.com';

interface PaymentSetupScreenProps {
  navigation: any;
}

const PaymentSetupScreen: React.FC<PaymentSetupScreenProps> = ({
  navigation,
}) => {
  const { logout } = useAuth();
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const hasAppStoreSub = user?.appStorePurchaseActive === true;
  const hasStripeSub = user?.stripeSubscriptionActive === true;
  const hasActiveSubscription = hasAppStoreSub || hasStripeSub;
  const isReturningUser = !!(
    user?.stripeCustomerId || user?.stripeSubscriptionId
  );

  useEffect(() => {
    if (!hasActiveSubscription) {
      pollingRef.current = setInterval(async () => {
        try {
          await refreshAuthUser(dispatch);
        } catch {
          // silent
        }
      }, 10000);
    }

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, [hasActiveSubscription, dispatch]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active' && !hasActiveSubscription) {
        refreshAuthUser(dispatch).catch(() => {});
      }
    });

    return () => subscription.remove();
  }, [hasActiveSubscription, dispatch]);

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      logout();
    }
  };

  const handleCompleteSetup = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Main' }],
    });
  };

  const handleOpenWebsite = () => {
    Linking.openURL(WEB_URL);
  };

  const renderContent = () => {
    if (hasAppStoreSub) {
      return (
        <View style={styles.messageContainer}>
          <Text style={styles.title}>Active Subscription</Text>
          <Text style={styles.messageText}>
            You currently have an active mobile subscription.
          </Text>
          <Text style={styles.messageText}>
            Your access will continue until the end of your current billing
            period.
          </Text>
          <Text style={styles.messageText}>
            After that, you can manage your account at
          </Text>
          <TouchableOpacity onPress={handleOpenWebsite}>
            <Text style={styles.linkText}>artist.pmuforms.com</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (hasStripeSub) {
      return (
        <View style={styles.messageContainer}>
          <Text style={styles.title}>Active Subscription</Text>
          <Text style={styles.messageText}>
            Your subscription is currently active.
          </Text>
          <Text style={styles.messageText}>
            Billing and account management are handled through your PMUForms
            account.
          </Text>
          <Text style={styles.messageText}>
            To view or update your subscription, please visit
          </Text>
          <TouchableOpacity onPress={handleOpenWebsite}>
            <Text style={styles.linkText}>artist.pmuforms.com</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (isReturningUser) {
      return (
        <View style={styles.messageContainer}>
          <Text style={styles.title}>Subscription Required</Text>
          <Text style={styles.messageText}>
            Your previous mobile subscription has ended.
          </Text>
          <Text style={styles.messageText}>
            To continue, please sign in at
          </Text>
          <TouchableOpacity onPress={handleOpenWebsite}>
            <Text style={styles.linkText}>artist.pmuforms.com</Text>
          </TouchableOpacity>
          <Text style={styles.messageText}>to manage your account.</Text>
          <View style={styles.spacer} />
          <Text style={styles.messageText}>
            Once completed, return to the app.
          </Text>
        </View>
      );
    }

    // New user, no subscription
    return (
      <View style={styles.messageContainer}>
        <Text style={styles.title}>Sign In Online to Continue</Text>
        <Text style={styles.messageText}>
          PMUForms accounts are managed online.
        </Text>
        <Text style={styles.messageText}>Please sign in at</Text>
        <TouchableOpacity onPress={handleOpenWebsite}>
          <Text style={styles.linkText}>artist.pmuforms.com</Text>
        </TouchableOpacity>
        <View style={styles.spacer} />
        <Text style={styles.messageText}>
          Once completed, return to the app.
        </Text>
      </View>
    );
  };

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
        {renderContent()}
      </ScrollView>

      <View style={styles.footer}>
        {hasActiveSubscription && (
          <TouchableOpacity
            style={styles.button}
            onPress={handleCompleteSetup}
          >
            <Text style={styles.buttonText}>Complete Setup</Text>
          </TouchableOpacity>
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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  messageContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
    marginBottom: 24,
    textAlign: 'center',
  },
  messageText: {
    fontSize: 16,
    color: colors.subtitleColor,
    lineHeight: 24,
    textAlign: 'center',
  },
  linkText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    lineHeight: 24,
    textDecorationLine: 'underline',
    marginVertical: 4,
  },
  spacer: {
    height: 16,
  },
  footer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: colors.borderColor,
    backgroundColor: colors.white,
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
});

export default PaymentSetupScreen;
