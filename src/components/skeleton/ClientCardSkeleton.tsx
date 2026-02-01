import React from 'react';
import { StyleSheet, View } from 'react-native';
import Skeleton from './Skeleton';

const ClientCardSkeleton: React.FC = () => {
  return (
    <View style={styles.card}>
      <Skeleton width={48} height={48} borderRadius={24} />
      <View style={styles.info}>
        <Skeleton width="60%" height={16} style={styles.name} />
        <Skeleton width="80%" height={14} style={styles.email} />
        <Skeleton width="50%" height={14} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  info: {
    flex: 1,
    marginLeft: 12,
    gap: 6,
  },
  name: {
    marginBottom: 4,
  },
  email: {
    marginBottom: 4,
  },
});

export default ClientCardSkeleton;
