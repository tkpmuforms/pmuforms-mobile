import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Trash2, Edit, AlertCircle } from 'lucide-react-native';
import ScreenHeader from '../../components/layout/ScreenHeader';
import useAuth from '../../hooks/useAuth';
import { Section, SingleForm } from '../../types';
import { deleteFormTemplate, getFormById } from '../../services/artistServices';
import DeleteConfirmModal from '../../components/forms/DeleteConfirmModal';
import { renderPreviewFormFields } from '../../components/forms/RenderPreviewFormFields';
import {
  DeleteIcon,
  EditDiffBackground,
  EditWhiteBackground,
} from '../../../assets/svg';
import { colors } from '../../theme/colors';

const PreviewFormsScreen = ({ route, navigation }: any) => {
  const { formId } = route.params;
  const { user } = useAuth();
  const [form, setForm] = useState<SingleForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        setLoading(true);
        const response = await getFormById(formId || '');

        if (response?.data?.form) {
          const formData = response.data.form;

          const transformedForm: SingleForm = {
            id: formData?.id || formData?._id || '',
            title: formData?.title || 'Untitled Form',
            type: formData?.type || 'consent',
            sections: (formData?.sections || [])
              .filter((section: Section) => !section?.skip)
              .map((section: Section) => ({
                ...section,
                _id: section?._id || section?.id,
              })),
          };

          const updatedForm = JSON.parse(
            JSON.stringify(transformedForm).replace(
              /\(?\{\{user\.businessName\}\}\)?/g,
              user?.businessName || 'Your Business Name',
            ),
          );

          setForm(updatedForm);
        } else {
          setForm(null);
        }
      } catch (error) {
        console.error('Error fetching form:', error);
        setForm(null);
      } finally {
        setLoading(false);
      }
    };

    if (formId) {
      fetchForm();
    }
  }, [formId, user?.businessName]);

  const handleDelete = async () => {
    try {
      await deleteFormTemplate(formId || '');
      Alert.alert('Success', 'Form deleted successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Error deleting form:', error);
      Alert.alert('Error', 'Failed to delete form');
    }
  };

  const handleEdit = () => {
    navigation.navigate('FormEdit', { formId });
  };

  if (!formId) {
    navigation.goBack();
    return null;
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!form) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No form found</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      <ScreenHeader
        title="Preview Form"
        onBack={() => navigation.goBack()}
        rightComponent={
          <View style={styles.headerActions}>
            <TouchableOpacity
              onPress={() => setShowConfirmDeleteModal(true)}
              style={styles.iconButton}
            >
              <DeleteIcon />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleEdit} style={styles.iconButton}>
              <EditDiffBackground />
            </TouchableOpacity>
          </View>
        }
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.formTitle}>{form.title}</Text>

        {/* Preview Alert */}
        <View style={styles.previewAlert}>
          <AlertCircle size={20} color="#f59e0b" />
          <View style={styles.previewTextContainer}>
            <Text style={styles.previewTitle}>Preview Mode</Text>
            <Text style={styles.previewDescription}>
              This is a preview of what your customer will see online. Form
              completion happens online.
            </Text>
          </View>
        </View>

        {/* Sections */}
        {form.sections && form.sections.length > 0 ? (
          form.sections.map(section => (
            <View key={section._id || section.id} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              {section.data && section.data.length > 0 ? (
                renderPreviewFormFields(section.data)
              ) : (
                <Text style={styles.noFieldsText}>
                  No fields in this section
                </Text>
              )}
            </View>
          ))
        ) : (
          <Text style={styles.noSectionsText}>
            No sections found in this form
          </Text>
        )}
      </ScrollView>

      {/* Delete Confirmation Modal */}
      {showConfirmDeleteModal && (
        <DeleteConfirmModal
          visible={showConfirmDeleteModal}
          onClose={() => setShowConfirmDeleteModal(false)}
          onConfirm={handleDelete}
          type="form"
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
    marginBottom: 24,
  },
  previewAlert: {
    flexDirection: 'row',
    backgroundColor: '#ffa21d1a',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    gap: 12,
  },
  previewTextContainer: {
    flex: 1,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  previewDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#444',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#eee',
  },
  noFieldsText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  noSectionsText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  backButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PreviewFormsScreen;
