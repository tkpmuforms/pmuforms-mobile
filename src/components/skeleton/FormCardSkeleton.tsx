import React from 'react';
import { StyleSheet, View } from 'react-native';
import Skeleton from './Skeleton';
import { colors } from '../../theme/colors';

const FormCardSkeleton: React.FC = () => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Skeleton width={40} height={40} borderRadius={8} />
        <View style={styles.headerInfo}>
          <Skeleton width="70%" height={16} style={styles.title} />
          <Skeleton width="50%" height={14} />
        </View>
      </View>
      <Skeleton width="100%" height={40} style={styles.description} />
      <View style={styles.footer}>
        <Skeleton width="30%" height={12} />
        <Skeleton width={80} height={32} borderRadius={8} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerInfo: {
    flex: 1,
    marginLeft: 12,
    gap: 6,
  },
  title: {
    marginBottom: 4,
  },
  description: {
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default FormCardSkeleton;
