import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Plus, Search } from 'lucide-react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import ClientCard from '../../components/clients/ClientCard';
import { searchCustomers } from '../../services/artistServices';
import { Client, CustomerResponse } from '../../types';
import { generateColor, generateInitials } from '../../utils/utils';

interface ClientScreenProps {
  navigation?: any;
}

const ClientScreen: React.FC<ClientScreenProps> = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalClients, setTotalClients] = useState(0);
  const isFirstMount = useRef(true);

  const convertToClient = (
    customer: CustomerResponse['customers'][0],
  ): Client => {
    const clientName = customer?.name ?? customer?.info?.client_name ?? '';
    return {
      id: customer?.id,
      name: clientName || 'No name provided',
      email: customer?.email || 'No email provided',
      initials: generateInitials(clientName),
      color: generateColor(clientName),
      phone: customer?.info?.cell_phone,
    };
  };

  const fetchCustomers = useCallback(
    async (searchName?: string, isInitialLoad = false) => {
      try {
        if (isInitialLoad) {
          setLoading(true);
        }

        const response = await searchCustomers(searchName, 1, 30);
        const data: CustomerResponse = response?.data;
        const convertedClients = data.customers?.map(convertToClient);
        setClients(convertedClients);
        setTotalClients(data.metadata.total);
      } catch (err) {
        console.error('Error fetching customers:', err);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to load clients',
        });
      } finally {
        if (isInitialLoad) {
          setLoading(false);
        }
      }
    },
    [],
  );

  useEffect(() => {
    fetchCustomers(undefined, true);
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        fetchCustomers(searchQuery.trim());
      } else {
        fetchCustomers();
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Refresh client list when screen comes into focus (after add/edit)
  useFocusEffect(
    useCallback(() => {
      // Skip the first mount since useEffect already handles initial load
      if (isFirstMount.current) {
        isFirstMount.current = false;
        return;
      }
      fetchCustomers();
    }, [fetchCustomers]),
  );

  const handleClientClick = (clientId: string) => {
    navigation.navigate('ClientDetails', { clientId });
  };

  const handleAddClient = () => {
    navigation.navigate('AddClient');
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View>
        <Text style={styles.title}>Your Clients</Text>
        <Text style={styles.subtitle}>
          Clients who fill out your forms will appear here
        </Text>
      </View>
    </View>
  );

  const renderSearchBar = () => (
    <View style={styles.searchContainer}>
      <View style={styles.searchInputWrapper}>
        <Search size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search clients..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateTitle}>No clients yet</Text>
      <Text style={styles.emptyStateText}>
        Add your first client to get started
      </Text>
    </View>
  );

  if (loading && clients.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8e2d8e" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      {renderHeader()}
      {renderSearchBar()}
      <TouchableOpacity style={styles.addButton} onPress={handleAddClient}>
        <Plus size={20} color="#8E2D8E" />
        <Text style={styles.addButtonText}>Tap Here to Add a New Client</Text>
      </TouchableOpacity>
      <Text style={styles.clientCount}>
        Total {totalClients === 1 ? 'Client' : 'Clients'} {totalClients}
      </Text>

      <FlatList
        data={clients}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ClientCard
            client={item}
            onClick={() => handleClientClick(item.id)}
          />
        )}
        contentContainerStyle={[
          styles.listContent,
          clients.length === 0 && styles.emptyListContent,
        ]}
        ListEmptyComponent={renderEmptyState}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#fff',
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8E2D8E14',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 16,
    marginLeft: 16,
    marginBottom: 12,
    borderRadius: 8,
    gap: 8,
  },
  addButtonText: {
    color: '#8E2D8E',
    fontSize: 14,
    fontWeight: '700',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#BCBBC133',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#000000',
  },
  clientCount: {
    fontSize: 14,
    paddingLeft: 16,
    color: '#000000',
    fontWeight: '500',
  },
  listContent: {
    paddingVertical: 8,
  },
  emptyListContent: {
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default ClientScreen;
