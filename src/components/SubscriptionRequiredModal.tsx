import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { refreshAuthUser } from '../utils/authUtils';

const WEB_URL = 'https://artist.pmuforms.com';

const SubscriptionRequiredModal: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const hasActiveSubscription =
    user?.stripeSubscriptionActive === true ||
    user?.appStorePurchaseActive === true;

  const visible = !hasActiveSubscription;

  useEffect(() => {
    if (visible) {
      pollingRef.current = setInterval(async () => {
        try {
          await refreshAuthUser(dispatch);
        } catch {
          // silent
        }
      }, 100000000); // 100,000 seconds (over a day) - adjust as needed
    }

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, [visible, dispatch]);

  const handleOpenWebsite = () => {
    Linking.openURL(WEB_URL);
  };

  const handleRefresh = async () => {
    try {
      await refreshAuthUser(dispatch);
    } catch {
      // silent
    }
  };

  if (!visible) return null;

  return (
    <Modal visible transparent animationType="fade">
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.overlay}>
          <View style={styles.card}>
            <Text style={styles.title}>Subscription Required</Text>

            <Text style={styles.messageText}>
              To access all features, please sign in at
            </Text>
            <TouchableOpacity onPress={handleOpenWebsite}>
              <Text style={styles.linkText}>artist.pmuforms.com</Text>
            </TouchableOpacity>
            <Text style={styles.messageText}>
              to manage your account and subscription.
            </Text>

            <View style={styles.spacer} />

            <Text style={styles.messageText}>
              Once completed, return to the app.
            </Text>

            <TouchableOpacity
              style={styles.refreshButton}
              onPress={handleRefresh}
            >
              <Text style={styles.refreshButtonText}>Refresh</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 32,
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000',
    marginBottom: 20,
    textAlign: 'center',
  },
  messageText: {
    fontSize: 15,
    color: colors.subtitleColor,
    lineHeight: 22,
    textAlign: 'center',
  },
  linkText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary,
    lineHeight: 22,
    textDecorationLine: 'underline',
    marginVertical: 4,
  },
  spacer: {
    height: 16,
  },
  refreshButton: {
    marginTop: 24,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
  },
  refreshButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '600',
  },
});

export default SubscriptionRequiredModal;
