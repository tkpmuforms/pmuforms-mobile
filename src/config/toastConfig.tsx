import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BaseToast } from 'react-native-toast-message';
import { colors } from '../theme/colors';

export const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={styles.successToast}
      contentContainerStyle={styles.contentContainer}
      text1Style={styles.text1}
      text2Style={styles.text2}
      text1NumberOfLines={2}
      text2NumberOfLines={2}
      renderLeadingIcon={() => (
        <View style={styles.iconContainer}>
          <View style={styles.successIcon}>
            <Text style={styles.iconText}>✓</Text>
          </View>
        </View>
      )}
    />
  ),
  error: (props: any) => (
    <BaseToast
      {...props}
      style={styles.errorToast}
      contentContainerStyle={styles.contentContainer}
      text1Style={styles.text1}
      text2Style={styles.text2}
      text1NumberOfLines={2}
      text2NumberOfLines={2}
      renderLeadingIcon={() => (
        <View style={styles.iconContainer}>
          <View style={styles.errorIcon}>
            <Text style={styles.iconText}>✕</Text>
          </View>
        </View>
      )}
    />
  ),
  info: (props: any) => (
    <BaseToast
      {...props}
      style={styles.infoToast}
      contentContainerStyle={styles.contentContainer}
      text1Style={styles.text1}
      text2Style={styles.text2}
      text1NumberOfLines={2}
      text2NumberOfLines={2}
      renderLeadingIcon={() => (
        <View style={styles.iconContainer}>
          <View style={styles.infoIcon}>
            <Text style={styles.iconText}>ℹ</Text>
          </View>
        </View>
      )}
    />
  ),
  warning: (props: any) => (
    <BaseToast
      {...props}
      style={styles.warningToast}
      contentContainerStyle={styles.contentContainer}
      text1Style={styles.text1}
      text2Style={styles.text2}
      text1NumberOfLines={2}
      text2NumberOfLines={2}
      renderLeadingIcon={() => (
        <View style={styles.iconContainer}>
          <View style={styles.warningIcon}>
            <Text style={styles.iconText}>⚠</Text>
          </View>
        </View>
      )}
    />
  ),
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  text1: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 2,
  },
  text2: {
    fontSize: 13,
    fontWeight: '400',
    color: colors.textLight,
  },
  successToast: {
    borderLeftColor: colors.success,
    borderLeftWidth: 5,
    backgroundColor: colors.white,
    borderRadius: 8,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    minHeight: 60,
  },
  errorToast: {
    borderLeftColor: colors.error,
    borderLeftWidth: 5,
    backgroundColor: colors.white,
    borderRadius: 8,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    minHeight: 60,
  },
  infoToast: {
    borderLeftColor: colors.info,
    borderLeftWidth: 5,
    backgroundColor: colors.white,
    borderRadius: 8,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    minHeight: 60,
  },
  warningToast: {
    borderLeftColor: colors.warning,
    borderLeftWidth: 5,
    backgroundColor: colors.white,
    borderRadius: 8,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    minHeight: 60,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  successIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.error,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.info,
    justifyContent: 'center',
    alignItems: 'center',
  },
  warningIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.warning,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 18,
  },
});
