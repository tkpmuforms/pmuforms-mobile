import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FileText } from 'lucide-react-native';

interface FormCardProps {
  id: string;
  title: string;
  lastUpdated: string;
  usedFor: string;
  onPreview: () => void;
  onEdit: () => void;
}

const FormCard: React.FC<FormCardProps> = ({
  title,
  lastUpdated,
  usedFor,
  onPreview,
  onEdit,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.content}>
        <View style={styles.header}>
          <FileText size={20} color="#A858F0" style={styles.icon} />
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
        </View>
        <View style={styles.meta}>
          <Text style={styles.metaText}>{lastUpdated}</Text>
          <Text style={styles.separator}>•</Text>
          <Text style={styles.metaText}>{usedFor}</Text>
        </View>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, styles.previewButton]}
          onPress={onPreview}
        >
          <Text style={styles.buttonText}>Preview</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.editButton]}
          onPress={onEdit}
        >
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    overflow: 'hidden',
    marginBottom: 12,
  },
  content: {
    backgroundColor: '#fbfbfb',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  icon: {
    marginTop: 2,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    lineHeight: 22,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 12,
    color: '#5d5d5d',
    fontWeight: '300',
  },
  separator: {
    fontSize: 12,
    color: '#717171',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    padding: 20,
    paddingTop: 16,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 24,
    alignItems: 'center',
  },
  previewButton: {
    backgroundColor: '#eeeeee',
  },
  editButton: {
    backgroundColor: '#eeeeee',
  },
  buttonText: {
    color: '#350035',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default FormCard;
