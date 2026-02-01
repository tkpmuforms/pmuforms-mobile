import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FileText, Download } from 'lucide-react-native';
import ScreenHeader from '../../components/layout/ScreenHeader';
import Toast from 'react-native-toast-message';
import useAuth from '../../hooks/useAuth';
import {
  getFilledFormByAppointmentAndTemplate,
  getFormById,
  getAppointmentById,
} from '../../services/artistServices';
import { colors } from '../../theme/colors';

interface FormField {
  id: string;
  type: string;
  title: string;
  required?: boolean;
  options?: string[];
  placeholder?: string;
  content?: string;
  [key: string]: any;
}

interface FormSection {
  _id?: string;
  id?: string;
  title: string;
  data: FormField[];
  skip?: boolean;
}

interface Form {
  id: string;
  title: string;
  sections: FormSection[];
}

interface FilledData {
  [key: string]: any;
}

interface RouteParams {
  appointmentId: string;
  templateId: string;
  clientId?: string;
}

const FilledFormsPreviewScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useAuth();
  const { appointmentId, templateId } = (route.params as RouteParams) || {};

  const [form, setForm] = useState<Form | null>(null);
  const [filledData, setFilledData] = useState<FilledData>({});
  const [loading, setLoading] = useState(true);
  const [signatureUrl, setSignatureUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [formResponse, filledResponse, appointmentResponse] =
          await Promise.all([
            getFormById(templateId || ''),
            getFilledFormByAppointmentAndTemplate(
              appointmentId || '',
              templateId || '',
            ),
            getAppointmentById(appointmentId || ''),
          ]);

        if (appointmentResponse?.data?.appointment) {
          const appointment = appointmentResponse.data.appointment;
          if (appointment.signed === true && appointment.signature_url) {
            setSignatureUrl(appointment.signature_url);
          }
        }

        if (formResponse?.data?.form) {
          const formData = formResponse.data.form;
          const transformedForm = {
            id: formData.id || formData._id,
            title: formData.title,
            sections: formData.sections
              .filter((section: FormSection) => !section.skip)
              .map((section: FormSection) => ({
                ...section,
                _id: section._id || section.id,
              })),
          };

          const updatedForm = JSON.parse(
            JSON.stringify(transformedForm).replace(
              /\(?\{\{user\.businessName\}\}\)?/g,
              user?.businessName || 'Your Business Name',
            ),
          );

          setForm(updatedForm);
        }

        if (filledResponse?.data?.filledForm?.data) {
          setFilledData(filledResponse.data.filledForm.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to load form data',
        });
      } finally {
        setLoading(false);
      }
    };

    if (appointmentId && templateId) {
      fetchData();
    }
  }, [appointmentId, templateId, user?.businessName]);

  const renderFieldValue = (field: FormField) => {
    const fieldId = field.id || field._id;
    const value = filledData[fieldId];

    switch (field.type) {
      case 'paragraph':
      case 'heading':
        return (
          <View style={styles.paragraphField}>
            <Text style={styles.paragraphText}>{field.content}</Text>
          </View>
        );

      case 'checkbox':
        if (Array.isArray(value)) {
          return (
            <View style={styles.checkboxContainer}>
              {field.options?.map((option, index) => (
                <View key={index} style={styles.checkboxItem}>
                  <View
                    style={[
                      styles.checkbox,
                      value.includes(option) && styles.checkboxChecked,
                    ]}
                  >
                    {value.includes(option) && (
                      <Text style={styles.checkboxCheck}>✓</Text>
                    )}
                  </View>
                  <Text style={styles.checkboxLabel}>{option}</Text>
                </View>
              ))}
            </View>
          );
        }
        return <Text style={styles.fieldValue}>None selected</Text>;

      case 'radio':
      case 'select':
      case 'dropdown':
        return (
          <View style={styles.radioContainer}>
            {field.options?.map((option, index) => (
              <View key={index} style={styles.radioItem}>
                <View
                  style={[
                    styles.radio,
                    value === option && styles.radioSelected,
                  ]}
                >
                  {value === option && <View style={styles.radioDot} />}
                </View>
                <Text style={styles.radioLabel}>{option}</Text>
              </View>
            ))}
          </View>
        );

      case 'signature':
        return value ? (
          <View style={styles.signatureContainer}>
            <Image
              source={{ uri: value }}
              style={styles.signatureImage}
              resizeMode="contain"
            />
          </View>
        ) : (
          <Text style={styles.fieldValue}>No signature provided</Text>
        );

      case 'date':
        return (
          <Text style={styles.fieldValue}>
            {value ? new Date(value).toLocaleDateString() : 'No date selected'}
          </Text>
        );

      case 'textarea':
        return (
          <Text style={styles.fieldValueMultiline}>
            {value || 'No response provided'}
          </Text>
        );

      default:
        return (
          <Text style={styles.fieldValue}>
            {value || 'No response provided'}
          </Text>
        );
    }
  };

  const handleGeneratePDF = () => {
    Toast.show({
      type: 'info',
      text1: 'Coming Soon',
      text2: 'PDF generation will be available soon',
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading form data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!form) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <FileText size={48} color={colors.textLight} />
          <Text style={styles.errorTitle}>No Form Found</Text>
          <Text style={styles.errorText}>
            The requested form could not be found.
          </Text>
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
      <ScrollView style={styles.scrollView}>
        <ScreenHeader
          title={form.title}
          onBack={() => navigation.goBack()}
          rightComponent={
            <TouchableOpacity
              style={styles.pdfButton}
              onPress={handleGeneratePDF}
            >
              <Download size={20} color={colors.white} />
              <Text style={styles.pdfButtonText}>Download PDF</Text>
            </TouchableOpacity>
          }
        />

        {/* Info Banner */}
        <View style={styles.infoBanner}>
          <Text style={styles.infoBannerTitle}>Filled Form Data</Text>
          <Text style={styles.infoBannerText}>
            This shows the data that was submitted by the customer for this
            appointment.
          </Text>
        </View>

        {/* Form Sections */}
        <View style={styles.formContent}>
          {form.sections && form.sections.length > 0 ? (
            form.sections.map(section => (
              <View key={section._id || section.id} style={styles.section}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                {section.data && section.data.length > 0 ? (
                  section.data.map(field => {
                    const fieldId = field.id || field._id;
                    const isParagraph =
                      field.type === 'paragraph' || field.type === 'heading';

                    return (
                      <View key={fieldId} style={styles.field}>
                        {!isParagraph && (
                          <Text style={styles.fieldLabel}>
                            {field.title}
                            {field.required && (
                              <Text style={styles.required}> *</Text>
                            )}
                          </Text>
                        )}
                        {renderFieldValue(field)}
                      </View>
                    );
                  })
                ) : (
                  <Text style={styles.emptyText}>
                    No fields in this section
                  </Text>
                )}
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No sections found in this form</Text>
          )}

          {/* Signature Section */}
          {signatureUrl && (
            <View style={styles.signatureSection}>
              <Text style={styles.signatureSectionTitle}>
                Customer Signature
              </Text>
              <View style={styles.signatureContainer}>
                <Image
                  source={{ uri: signatureUrl }}
                  style={styles.signatureImage}
                  resizeMode="contain"
                />
              </View>
            </View>
          )}

          {user?.signature_url && (
            <View style={styles.signatureSection}>
              <Text style={styles.signatureSectionTitle}>Artist Signature</Text>
              <View style={styles.signatureContainer}>
                <Image
                  source={{ uri: user.signature_url }}
                  style={styles.signatureImage}
                  resizeMode="contain"
                />
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  pdfButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    gap: 8,
  },
  pdfButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  infoBanner: {
    backgroundColor: '#FFF9E6',
    padding: 16,
    margin: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
  },
  infoBannerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  infoBannerText: {
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 20,
  },
  formContent: {
    padding: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: colors.border,
  },
  field: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  required: {
    color: colors.error,
  },
  fieldValue: {
    fontSize: 14,
    color: colors.text,
    backgroundColor: colors.backgroundLight,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  fieldValueMultiline: {
    fontSize: 14,
    color: colors.text,
    backgroundColor: colors.backgroundLight,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 80,
  },
  paragraphField: {
    marginBottom: 8,
  },
  paragraphText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  checkboxContainer: {
    gap: 12,
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkboxCheck: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  checkboxLabel: {
    fontSize: 14,
    color: colors.text,
  },
  radioContainer: {
    gap: 12,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: colors.primary,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  radioLabel: {
    fontSize: 14,
    color: colors.text,
  },
  signatureContainer: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 16,
    backgroundColor: colors.white,
  },
  signatureImage: {
    width: '100%',
    height: 150,
  },
  signatureSection: {
    marginTop: 32,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  signatureSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textLight,
    fontStyle: 'italic',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    fontSize: 16,
    color: colors.textLight,
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  backButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FilledFormsPreviewScreen;
