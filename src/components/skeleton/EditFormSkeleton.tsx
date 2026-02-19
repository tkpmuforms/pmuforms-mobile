import React from 'react';
import { StyleSheet, View } from 'react-native';
import Skeleton from './Skeleton';
import { colors } from '../../theme/colors';

const FieldSkeleton: React.FC = () => (
  <View style={styles.fieldItem}>
    <View style={styles.fieldRow}>
      <View style={styles.fieldInfo}>
        <Skeleton width="75%" height={14} />
        <Skeleton width="30%" height={12} style={styles.fieldType} />
      </View>
      <View style={styles.fieldActions}>
        <Skeleton width={32} height={32} borderRadius={16} />
        <Skeleton width={32} height={32} borderRadius={16} />
      </View>
    </View>
  </View>
);

const SectionSkeleton: React.FC<{ fieldCount?: number }> = ({
  fieldCount = 3,
}) => (
  <View style={styles.section}>
    <Skeleton width="40%" height={18} style={styles.sectionTitle} />
    <View style={styles.fieldsList}>
      {Array.from({ length: fieldCount }).map((_, i) => (
        <FieldSkeleton key={i} />
      ))}
    </View>
  </View>
);

const EditFormSkeleton: React.FC = () => {
  return (
    <View>
      {/* Header skeleton */}
      <View style={styles.header}>
        <Skeleton width="60%" height={20} />
        <Skeleton width={60} height={32} borderRadius={6} />
      </View>

      <View style={styles.content}>
        {/* Services section skeleton */}
        <View style={styles.servicesSection}>
          <View style={styles.servicesHeader}>
            <Skeleton width={80} height={16} />
            <Skeleton width={120} height={14} />
          </View>
          <View style={styles.chipRow}>
            <Skeleton width={90} height={28} borderRadius={16} />
            <Skeleton width={110} height={28} borderRadius={16} />
            <Skeleton width={80} height={28} borderRadius={16} />
          </View>
        </View>

        {/* Section skeletons */}
        <SectionSkeleton fieldCount={3} />
        <SectionSkeleton fieldCount={2} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  content: {
    padding: 16,
  },
  servicesSection: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  servicesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
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
    marginBottom: 12,
  },
  fieldsList: {
    gap: 12,
  },
  fieldItem: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  fieldRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  fieldInfo: {
    flex: 1,
    marginRight: 8,
    gap: 6,
  },
  fieldType: {
    marginTop: 2,
  },
  fieldActions: {
    flexDirection: 'row',
    gap: 8,
  },
});

export default EditFormSkeleton;
