import React from 'react';
import { StyleSheet, View } from 'react-native';
import Skeleton from './Skeleton';

const AppointmentCardSkeleton: React.FC = () => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Skeleton width={48} height={48} borderRadius={24} />
        <View style={styles.info}>
          <Skeleton width="70%" height={16} style={styles.name} />
          <Skeleton width="50%" height={14} />
        </View>
      </View>
      <View style={styles.details}>
        <Skeleton width="40%" height={14} />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  info: {
    flex: 1,
    marginLeft: 12,
    gap: 6,
  },
  name: {
    marginBottom: 4,
  },
  details: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
});

export default AppointmentCardSkeleton;
