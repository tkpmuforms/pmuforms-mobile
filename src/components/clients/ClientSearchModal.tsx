import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { Search, ChevronRight } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { searchCustomers } from '../../services/artistServices';
import { CustomerResponse } from '../../types';
import { generateInitials } from '../../utils/utils';

interface ClientSearchModalProps {
  visible: boolean;
  onClose: () => void;
  onClientSelect: (clientId: string) => void;
}

interface RecentSearch {
  id: string;
  name: string;
  email: string;
  initials: string;
}

interface SearchResult {
  id: string;
  name: string;
  email: string;
  initials: string;
}

const RECENT_SEARCHES_KEY = 'recentClientSearches';

const ClientSearchModal: React.FC<ClientSearchModalProps> = ({
  visible,
  onClose,
  onClientSelect,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    loadRecentSearches();
  }, []);

  const loadRecentSearches = async () => {
    try {
      const stored = await AsyncStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading recent searches:', error);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (searchQuery.trim()) {
        setIsSearching(true);
        try {
          const response = await searchCustomers(searchQuery.trim(), 1, 10);
          const data: CustomerResponse = response.data;

          const results = data.customers.map(customer => ({
            id: customer.id,
            name: customer.name,
            email: customer.email || 'No email provided',
            initials: generateInitials(customer.name),
          }));

          setSearchResults(results);
        } catch (error) {
          console.error('Search error:', error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const saveToRecentSearches = async (client: SearchResult) => {
    const newRecentSearch: RecentSearch = {
      id: client.id,
      name: client.name,
      email: client.email,
      initials: client.initials,
    };

    const filtered = recentSearches.filter(item => item.id !== client.id);
    const updated = [newRecentSearch, ...filtered].slice(0, 5);

    setRecentSearches(updated);
    try {
      await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving recent search:', error);
    }
  };

  const handleClientClick = (client: SearchResult | RecentSearch) => {
    saveToRecentSearches(client);
    onClientSelect(client.id);
    onClose();
  };

  const displayItems = searchQuery.trim() ? searchResults : recentSearches;
  const sectionTitle = searchQuery.trim()
    ? 'Search Results'
    : 'Recent searches';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.overlay} onTouchEnd={onClose}>
          <View style={styles.modal}>
            <View style={styles.searchContainer}>
              <Search size={20} color="#64748b" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="search name, email, phone number"
                placeholderTextColor="#94a3b8"
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
              />
            </View>

            <View style={styles.resultsContainer}>
              <Text style={styles.sectionTitle}>{sectionTitle}</Text>

              {isSearching ? (
                <View style={styles.loadingState}>
                  <ActivityIndicator size="small" color="#8e2d8e" />
                  <Text style={styles.loadingText}>Searching...</Text>
                </View>
              ) : displayItems.length > 0 ? (
                <ScrollView
                  style={styles.resultsList}
                  showsVerticalScrollIndicator={false}
                >
                  {displayItems.map(client => (
                    <TouchableOpacity
                      key={client.id}
                      style={styles.resultItem}
                      onPress={() => handleClientClick(client)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.resultAvatar}>
                        <Text style={styles.resultInitials}>
                          {client.initials}
                        </Text>
                      </View>
                      <View style={styles.resultInfo}>
                        <Text style={styles.resultName} numberOfLines={1}>
                          {client.name}
                        </Text>
                        <Text style={styles.resultEmail} numberOfLines={1}>
                          {client.email}
                        </Text>
                      </View>
                      <ChevronRight size={16} color="#94a3b8" />
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              ) : searchQuery.trim() ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyText}>
                    No clients found matching "{searchQuery}"
                  </Text>
                </View>
              ) : (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyText}>No recent searches</Text>
                </View>
              )}
            </View>
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
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.1,
    shadowRadius: 25,
    elevation: 10,
  },
  searchContainer: {
    position: 'relative',
    marginBottom: 24,
  },
  searchIcon: {
    position: 'absolute',
    left: 16,
    top: 12,
    zIndex: 1,
  },
  searchInput: {
    width: '100%',
    paddingVertical: 12,
    paddingLeft: 48,
    paddingRight: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    fontSize: 14,
    color: '#1e293b',
    backgroundColor: '#f8fafc',
  },
  resultsContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  resultsList: {
    flex: 1,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    gap: 12,
  },
  resultAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#8e2d8e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultInitials: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  resultInfo: {
    flex: 1,
    minWidth: 0,
  },
  resultName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1e293b',
    marginBottom: 2,
  },
  resultEmail: {
    fontSize: 12,
    color: '#64748b',
  },
  loadingState: {
    paddingVertical: 40,
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: '#64748b',
  },
  emptyState: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#64748b',
    fontStyle: 'italic',
    textAlign: 'center',
  },
});

export default ClientSearchModal;
