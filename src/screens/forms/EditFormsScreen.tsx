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
import { useRoute, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Edit, Trash2, Plus } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { colors } from '../../theme/colors';
import useAuth from '../../hooks/useAuth';
import AddFieldModal from '../../components/forms/AddFieldModal';
import FieldInputModal from '../../components/forms/FieldInputModal';
import EditParagraphModal from '../../components/forms/EditParagraphModal';
import EditFormServices from '../../components/forms/EditFormServices';

import {
  deleteFormSectionData,
  getFormById,
  getServices,
  updateFormSectionData,
  updateFormServices,
  addFormSectionData,
} from '../../services/artistServices';
import { FieldData, Section, Service, SingleForm } from '../../types';

const EditFormsScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { user } = useAuth();
  const { formId } = (route.params as { formId?: string }) || {};

  const [form, setForm] = useState<SingleForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [allServices, setAllServices] = useState<Service[]>([]);
  const [showAddFieldModal, setShowAddFieldModal] = useState(false);
  const [showFieldInputModal, setShowFieldInputModal] = useState(false);
  const [showEditParagraphModal, setShowEditParagraphModal] = useState(false);
  const [showServicesModal, setShowServicesModal] = useState(false);
  const [selectedFieldType, setSelectedFieldType] = useState<any>(null);
  const [selectedField, setSelectedField] = useState<FieldData | null>(null);
  const [currentSectionId, setCurrentSectionId] = useState<string>('');

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    if (formId) {
      fetchForm();
    }
  }, [formId]);

  const fetchServices = async () => {
    try {
      const response = await getServices();
      const services: Service[] = (response?.data?.services || []).map(
        (service: Service) => ({
          _id: service?._id || '',
          id: service?.id || 0,
          service: service?.service || '',
        }),
      );
      setAllServices(services);
    } catch (error) {
      console.error('Error fetching services:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to fetch services',
      });
    }
  };

  const fetchForm = async () => {
    if (!formId) return;

    try {
      setLoading(true);

      const response = await getFormById(formId);

      if (response?.data?.form) {
        const formData = response.data.form;

        const transformedForm: SingleForm = {
          id: formData?.id || formData?._id || '',
          type: formData?.type || 'consent',
          title: formData?.title || '',
          sections: (formData?.sections || []).map((section: Section) => ({
            ...section,
            _id: section?._id || section?.id,
          })),
          services: formData?.services || [],
        };

        const updatedForm = JSON.parse(
          JSON.stringify(transformedForm).replace(
            /\(?\{\{user\.businessName\}\}\)?/g,
            user?.businessName || 'Your Business Name',
          ),
        );

        setForm(updatedForm);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'No form data found',
        });
        setForm(null);
      }
    } catch (error) {
      console.error('Error fetching form:', error);
      setForm(null);
    } finally {
      setLoading(false);
    }
  };

  const handleEditField = (field: FieldData) => {
    setSelectedField(field);

    if (field.type === 'paragraph' || field.type === 'heading') {
      setShowEditParagraphModal(true);
    } else {
      setSelectedFieldType({
        type: field.type,
        title: field.type.charAt(0).toUpperCase() + field.type.slice(1),
      });
      setShowFieldInputModal(true);
    }
  };

  const handleDeleteField = (field: FieldData) => {
    Alert.alert(
      'Delete Field',
      `Are you sure you want to delete "${field.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            if (!form || !field) return;

            try {
              await deleteFormSectionData(
                form.id,
                field.sectionId || '',
                field.id,
              );

              const updatedForm = { ...form };
              updatedForm.sections = updatedForm.sections.map(section => {
                if (
                  section.id === field.sectionId ||
                  section._id === field.sectionId
                ) {
                  return {
                    ...section,
                    data: section.data.filter(f => f.id !== field.id),
                  };
                }
                return section;
              });
              setForm(updatedForm);

              Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Field deleted successfully',
              });
            } catch (error) {
              console.error('Error deleting field:', error);
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to delete field',
              });
            }
          },
        },
      ],
    );
  };

  const handleAddField = (sectionId: string) => {
    setCurrentSectionId(sectionId);
    setShowAddFieldModal(true);
  };

  const handleFieldTypeSelect = (fieldType: any) => {
    setSelectedFieldType(fieldType);
    setShowAddFieldModal(false);

    if (fieldType.type === 'paragraph') {
      setShowEditParagraphModal(true);
    } else {
      setShowFieldInputModal(true);
    }
  };

  const handleSaveForm = () => {
    Toast.show({
      type: 'success',
      text1: 'Success',
      text2: 'Form saved successfully',
    });
  };

  const handleManageServices = () => {
    setShowServicesModal(true);
  };

  const handleUpdateServices = async (selectedServiceIds: number[]) => {
    if (!form) return;

    try {
      await updateFormServices(form.id, selectedServiceIds);

      const updatedForm = { ...form };
      updatedForm.services = selectedServiceIds;
      setForm(updatedForm);

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Services updated successfully',
      });
    } catch (error) {
      console.error('Error updating services:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to update services',
      });
    }
  };

  const handleSaveFieldInput = async (title: string, isRequired: boolean) => {
    if (!form) return;

    try {
      if (selectedField) {
        await updateFormSectionData(
          form.id,
          selectedField.sectionId || '',
          selectedField.id,
          { title, required: isRequired },
        );

        const updatedForm = { ...form };
        updatedForm.sections = updatedForm.sections.map(section => {
          if (
            section.id === selectedField.sectionId ||
            section._id === selectedField.sectionId
          ) {
            return {
              ...section,
              data: section.data.map(f =>
                f.id === selectedField.id
                  ? { ...f, title, required: isRequired }
                  : f,
              ),
            };
          }
          return section;
        });
        setForm(updatedForm);

        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Field updated successfully',
        });
      } else {
        const newField = {
          type: selectedFieldType.type,
          title,
          required: isRequired,
        };

        await addFormSectionData(form.id, currentSectionId, newField);

        await fetchForm();

        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Field added successfully',
        });
      }

      setShowFieldInputModal(false);
      setSelectedField(null);
      setSelectedFieldType(null);
    } catch (error) {
      console.error('Error saving field:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to save field',
      });
    }
  };

  const handleSaveParagraph = async (content: string) => {
    if (!form) return;

    try {
      if (selectedField) {
        await updateFormSectionData(
          form.id,
          selectedField.sectionId || '',
          selectedField.id,
          { content },
        );

        const updatedForm = { ...form };
        updatedForm.sections = updatedForm.sections.map(section => {
          if (
            section.id === selectedField.sectionId ||
            section._id === selectedField.sectionId
          ) {
            return {
              ...section,
              data: section.data.map(f =>
                f.id === selectedField.id ? { ...f, content } : f,
              ),
            };
          }
          return section;
        });
        setForm(updatedForm);

        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Paragraph updated successfully',
        });
      } else {
        const newParagraph = {
          type: 'paragraph',
          content,
        };

        await addFormSectionData(form.id, currentSectionId, newParagraph);

        await fetchForm();

        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Paragraph added successfully',
        });
      }

      setShowEditParagraphModal(false);
      setSelectedField(null);
    } catch (error) {
      console.error('Error saving paragraph:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to save paragraph',
      });
    }
  };

  const renderField = (field: FieldData, index: number) => {
    return (
      <View key={field.id || index} style={styles.fieldItem}>
        <View style={styles.fieldHeader}>
          <View style={styles.fieldInfo}>
            <Text style={styles.fieldTitle}>
              {field.title}
              {field.required && <Text style={styles.required}> *</Text>}
            </Text>
            <Text style={styles.fieldType}>{field.type}</Text>
          </View>
          <View style={styles.fieldActions}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => handleEditField(field)}
            >
              <Edit size={16} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => handleDeleteField(field)}
            >
              <Trash2 size={16} color={colors.error} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const renderSection = (section: Section) => {
    return (
      <View key={section._id || section.id} style={styles.section}>
        <Text style={styles.sectionTitle}>{section.title}</Text>

        {section.data && section.data.length > 0 ? (
          <View style={styles.fieldsList}>
            {section.data.map((field, index) => {
              const fieldWithSection = {
                ...field,
                sectionId: section._id || section.id,
              };
              return renderField(fieldWithSection, index);
            })}
          </View>
        ) : (
          <Text style={styles.noFieldsText}>No fields in this section</Text>
        )}

        <TouchableOpacity
          style={styles.addFieldButton}
          onPress={() => handleAddField(section._id || section.id)}
        >
          <Plus size={16} color={colors.primary} />
          <Text style={styles.addFieldText}>Add Field</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (!formId) {
    navigation.goBack();
    return null;
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
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
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={1}>
          {form.title}
        </Text>
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveForm}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Services Section */}
        <View style={styles.servicesSection}>
          <View style={styles.servicesSectionHeader}>
            <Text style={styles.servicesTitle}>Services</Text>
            <TouchableOpacity onPress={handleManageServices}>
              <Text style={styles.manageServicesLink}>Manage Services</Text>
            </TouchableOpacity>
          </View>

          {form.services && form.services.length > 0 ? (
            <View style={styles.servicesList}>
              {form.services.map((serviceId, index) => {
                const service = allServices.find(s => s.id === serviceId);
                return (
                  <View key={serviceId || index} style={styles.serviceChip}>
                    <Text style={styles.serviceChipText}>
                      {service?.service || `Service ${serviceId}`}
                    </Text>
                  </View>
                );
              })}
            </View>
          ) : (
            <Text style={styles.noServicesText}>No services selected</Text>
          )}
        </View>

        {form.sections && form.sections.length > 0 ? (
          form.sections.map(section => renderSection(section))
        ) : (
          <Text style={styles.noSectionsText}>
            No sections found in this form
          </Text>
        )}
      </ScrollView>

      {/* Modals */}
      <AddFieldModal
        visible={showAddFieldModal}
        onClose={() => setShowAddFieldModal(false)}
        onSelectFieldType={handleFieldTypeSelect}
      />

      <FieldInputModal
        visible={showFieldInputModal}
        onClose={() => {
          setShowFieldInputModal(false);
          setSelectedField(null);
          setSelectedFieldType(null);
        }}
        onSave={handleSaveFieldInput}
        fieldType={selectedFieldType || { type: 'text', title: 'Field' }}
        initialTitle={selectedField?.title}
        initialRequired={selectedField?.required}
      />

      <EditParagraphModal
        visible={showEditParagraphModal}
        onClose={() => {
          setShowEditParagraphModal(false);
          setSelectedField(null);
        }}
        onSave={handleSaveParagraph}
        initialContent={selectedField?.content}
      />

      <EditFormServices
        visible={showServicesModal}
        onClose={() => setShowServicesModal(false)}
        allServices={allServices}
        selectedServices={form?.services || []}
        onUpdateServices={handleUpdateServices}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textLight,
    marginBottom: 16,
  },
  backButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginRight: 16,
  },
  saveButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  saveButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
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
  servicesSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  servicesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  manageServicesLink: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  servicesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  serviceChip: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  serviceChipText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  noServicesText: {
    fontSize: 14,
    color: colors.textLight,
    fontStyle: 'italic',
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
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
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
  fieldHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  fieldInfo: {
    flex: 1,
    marginRight: 8,
  },
  fieldTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  required: {
    color: colors.error,
  },
  fieldType: {
    fontSize: 12,
    color: colors.textLight,
    textTransform: 'capitalize',
  },
  fieldActions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noFieldsText: {
    fontSize: 14,
    color: colors.textLight,
    fontStyle: 'italic',
    marginBottom: 12,
  },
  addFieldButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.primary,
    marginTop: 12,
    gap: 6,
  },
  addFieldText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  noSectionsText: {
    fontSize: 14,
    color: colors.textLight,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default EditFormsScreen;
