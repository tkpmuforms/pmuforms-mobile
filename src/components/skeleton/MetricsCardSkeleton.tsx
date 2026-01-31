import React from 'react';
import { StyleSheet, View } from 'react-native';
import Skeleton from './Skeleton';

const MetricsCardSkeleton: React.FC = () => {
  return (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <Skeleton width={24} height={24} borderRadius={12} />
      </View>
      <View style={styles.content}>
        <Skeleton width="60%" height={12} style={styles.title} />
        <Skeleton width="40%" height={24} style={styles.value} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 2,
  },
  iconContainer: {
    marginBottom: 12,
  },
  content: {
    gap: 8,
  },
  title: {
    marginBottom: 4,
  },
  value: {
    marginTop: 4,
  },
});

export default MetricsCardSkeleton;
