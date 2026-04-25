import { Edit2 } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import UpdateServicesModal from '../../components/profile/UpdateServicesModal';
import useAuth from '../../hooks/useAuth';
import { colors } from '../../theme/colors';
import { Service } from '../../types';

const ServicesScreen: React.FC = () => {
  const { user } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [services, setServices] = useState<Service[]>(user?.services || []);

  useEffect(() => {
    setServices(user?.services || []);
  }, [user?.services]);

  const handleModalClose = () => {
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Services</Text>
          <Text style={styles.subtitle}>
            {services.length} service{services.length !== 1 ? 's' : ''} offered
          </Text>
        </View>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => setModalVisible(true)}
        >
          <Edit2 size={16} color={colors.white} />
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
      </View>

      {services.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No services added</Text>
          <Text style={styles.emptySubtitle}>
            Tap Edit to add the services you offer.
          </Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          {services.map(item => (
            <View key={item._id} style={styles.serviceRow}>
              <View style={styles.serviceIndicator} />
              <Text style={styles.serviceName}>{item.service}</Text>
            </View>
          ))}
        </ScrollView>
      )}

      <UpdateServicesModal
        visible={modalVisible}
        onClose={handleModalClose}
        onGoBack={handleModalClose}
        noGoBack
      />
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.black,
  },
  subtitle: {
    fontSize: 13,
    color: colors.subtitleColor,
    marginTop: 2,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  editButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.backgroundLight,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderColor,
  },
  serviceIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  serviceName: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.black,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.black,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.subtitleColor,
    textAlign: 'center',
  },
});

export default ServicesScreen;
