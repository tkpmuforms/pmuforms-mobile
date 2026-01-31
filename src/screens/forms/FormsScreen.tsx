import { Plus } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormCard from '../../components/forms/FormCard';
import UpdateServicesModal from '../../components/profile/UpdateServicesModal';
import FormCardSkeleton from '../../components/skeleton/FormCardSkeleton';
import { getArtistForms } from '../../services/artistServices';
import { Form } from '../../types';
import { transformFormData } from '../../utils/utils';

const FormsScreen = ({ navigation }: any) => {
  const [activeTab, setActiveTab] = useState<'consent' | 'care'>('consent');
  const [showAddMoreServicesModal, setShowAddMoreServicesModal] =
    useState(false);
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredForms = forms.filter(form => {
    const matchesTab = form.type === activeTab;
    const matchesSearch =
      searchTerm === '' ||
      form.title?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const fetchForms = async () => {
    try {
      setLoading(true);
      const response = await getArtistForms();
      if (response && response.data && response.data.forms) {
        const transformedForms = response.data.forms.map(transformFormData);
        setForms(transformedForms);
      }
    } catch (err) {
      console.error('Error fetching forms:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForms();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchForms();
    setRefreshing(false);
  };

  const handlePreview = (formId: string) => {
    navigation.navigate('FormPreview', { formId });
  };

  const handleEdit = (formId: string) => {
    navigation.navigate('FormEdit', { formId });
  };

  const consentCount = forms.filter(f => f.type === 'consent').length;
  const careCount = forms.filter(f => f.type === 'care').length;

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      <View style={styles.header}>
        <Text style={styles.title}>Preview Forms</Text>
        <Text style={styles.subtitle}>Preview and manage all forms</Text>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search forms by title..."
          placeholderTextColor="#94a3b8"
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'consent' && styles.tabActive]}
          onPress={() => setActiveTab('consent')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'consent' && styles.tabTextActive,
            ]}
          >
            Consent ({consentCount})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'care' && styles.tabActive]}
          onPress={() => setActiveTab('care')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'care' && styles.tabTextActive,
            ]}
          >
            Care ({careCount})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Forms Grid - Only this scrolls */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.grid}>
          {loading ? (
            <View style={styles.skeletonContainer}>
              {[1, 2, 3, 4].map(index => (
                <FormCardSkeleton key={index} />
              ))}
            </View>
          ) : filteredForms.length > 0 ? (
            filteredForms.map(form => (
              <FormCard
                key={form.id}
                {...form}
                onPreview={() => handlePreview(form.id)}
              />
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                No {activeTab} forms found
                {searchTerm ? ` matching "${searchTerm}"` : ''}.
              </Text>
              <TouchableOpacity
                style={styles.emptyButton}
                onPress={() => setShowAddMoreServicesModal(true)}
              >
                <Plus size={16} color="#fff" />
                <Text style={styles.emptyButtonText}>
                  Unlock Your{' '}
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Forms
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowAddMoreServicesModal(true)}
      >
        <Plus size={24} color="#fff" />
      </TouchableOpacity>

      {/* Modal */}
      {showAddMoreServicesModal && (
        <UpdateServicesModal
          visible={showAddMoreServicesModal}
          onClose={() => setShowAddMoreServicesModal(false)}
          onGoBack={() => setShowAddMoreServicesModal(false)}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  header: {
    marginTop: 16,
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#8E2D8E',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  searchContainer: {
    flexDirection: 'row',

    alignItems: 'center',
    marginBottom: 24,
    position: 'relative',
    paddingHorizontal: 20,
  },
  searchIcon: {
    position: 'absolute',
    left: 12,
    zIndex: 1,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    paddingLeft: 44,
    paddingRight: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    fontSize: 16,
    backgroundColor: '#BCBBC133',
  },
  tabs: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  tab: {
    flex: 1,
    height: 46,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#fff',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActive: {
    backgroundColor: '#F8F5F8',
    borderColor: '#e2e8f0',
  },
  tabText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#000',
    fontWeight: '600',
  },
  grid: {
    gap: 1,
  },
  skeletonContainer: {
    paddingHorizontal: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyText: {
    color: '#64748b',
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8e2d8e',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default FormsScreen;
