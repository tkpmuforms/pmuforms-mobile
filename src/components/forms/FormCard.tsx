import { ChevronRight } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Forms } from '../../../assets/svg';

interface FormCardProps {
  id: string;
  title: string;
  lastUpdated: string;
  usedFor: string;
  onPreview: () => void;
}

const FormCard: React.FC<FormCardProps> = ({
  title,
  lastUpdated,
  usedFor,
  onPreview,
}) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPreview}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Forms />
          <View style={styles.textContainer}>
            <Text style={styles.title} numberOfLines={2}>
              {title}
            </Text>
            <View style={styles.meta}>
              <Text style={styles.metaText}>{lastUpdated}</Text>
              <Text style={styles.separator}>•</Text>
              <Text style={styles.metaText}>{usedFor}</Text>
            </View>
          </View>
          <ChevronRight size={20} color="#94a3b8" style={styles.chevron} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderBottomColor: '#e0e0e0',
    borderBottomWidth: 1,
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  icon: {
    marginTop: 2,
  },
  chevron: {
    marginTop: 2,
  },
  textContainer: {
    flex: 1,
    gap: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    lineHeight: 20,
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
