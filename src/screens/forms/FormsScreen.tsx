import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Search } from 'lucide-react-native';
import { getArtistForms } from '../../services/artistServices';
import { transformFormData } from '../../utils/utils';
import FormCard from '../../components/forms/FormCard';
import UpdateServicesModal from '../../components/profile/UpdateServicesModal';
import { Form } from '../../types';

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
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Preview Forms</Text>
            <Text style={styles.subtitle}>Preview and manage all forms</Text>
          </View>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => setShowAddMoreServicesModal(true)}
          >
            <Plus size={16} color="#fff" />
            <Text style={styles.createButtonText}>Unlock More Forms</Text>
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Search size={20} color="#64748b" style={styles.searchIcon} />
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

        {/* Forms Grid */}
        <View style={styles.grid}>
          {filteredForms.length > 0 ? (
            filteredForms.map(form => (
              <FormCard
                key={form.id}
                {...form}
                onPreview={() => handlePreview(form.id)}
                onEdit={() => handleEdit(form.id)}
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
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  header: {
    marginTop: 16,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 16,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8e2d8e',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    position: 'relative',
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
    backgroundColor: '#fff',
  },
  tabs: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#fff',
    borderRadius: 24,
  },
  tabActive: {
    borderColor: '#8e2d8e',
  },
  tabText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#000',
  },
  grid: {
    gap: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
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
