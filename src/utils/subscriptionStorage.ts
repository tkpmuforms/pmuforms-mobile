import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuthMe } from '../services/artistServices';
import { setUser } from '../redux/auth';
import { Dispatch } from '@reduxjs/toolkit';
import { SubscriptionData } from '../types';

const SUBSCRIPTION_KEY = 'pmu_subscription_data';

export const saveSubscriptionToStorage = async (
  subscriptionData: any,
): Promise<void> => {
  try {
    const data: SubscriptionData = {
      id: subscriptionData.id,
      status: subscriptionData.status,
      currentPeriodEnd:
        subscriptionData.items.data[0]?.current_period_end ||
        subscriptionData.current_period_end,
      currentPeriodStart:
        subscriptionData.items.data[0]?.current_period_start ||
        subscriptionData.current_period_start,
      priceId:
        subscriptionData.items.data[0]?.price.id || subscriptionData.plan?.id,
      interval:
        subscriptionData.items.data[0]?.price.recurring?.interval ||
        subscriptionData.plan?.interval,
      intervalCount:
        subscriptionData.items.data[0]?.price.recurring?.interval_count ||
        subscriptionData.plan?.interval_count ||
        1,
      amount:
        subscriptionData.items.data[0]?.price.unit_amount ||
        subscriptionData.plan?.amount,
      currency:
        subscriptionData.items.data[0]?.price.currency ||
        subscriptionData.currency,
      cancelAt: subscriptionData.cancel_at,
    };

    await AsyncStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving subscription to storage:', error);
  }
};

export const getSubscriptionFromStorage =
  async (): Promise<SubscriptionData | null> => {
    try {
      const data = await AsyncStorage.getItem(SUBSCRIPTION_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting subscription from storage:', error);
      return null;
    }
  };

export const clearSubscriptionFromStorage = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(SUBSCRIPTION_KEY);
  } catch (error) {
    console.error('Error clearing subscription from storage:', error);
  }
};

export const formatNextBillingDate = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const getPlanName = (
  interval: string,
  intervalCount: number = 1,
): string => {
  if (interval === 'week') {
    return intervalCount === 1 ? 'Weekly Plan' : `${intervalCount}-Week Plan`;
  }
  if (interval === 'month') {
    return intervalCount === 1 ? 'Monthly Plan' : `${intervalCount}-Month Plan`;
  }
  if (interval === 'year') {
    return intervalCount === 1 ? 'Yearly Plan' : `${intervalCount}-Year Plan`;
  }
  return 'Subscription Plan';
};

export const isSubscriptionActive = (status: string): boolean => {
  return ['active', 'trialing'].includes(status.toLowerCase());
};

export const refreshAuthUser = async (dispatch: Dispatch): Promise<void> => {
  try {
    const response = await getAuthMe();
    if (response?.data?.user) {
      dispatch(setUser(response.data.user));
    }
  } catch (error) {
    console.error('Error refreshing auth user:', error);
    throw error; // Re-throw to allow caller to handle errors
  }
};
