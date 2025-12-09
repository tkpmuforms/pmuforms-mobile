import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Users, FileText, Clock, Calendar } from 'lucide-react-native';

export interface MetricsCardProps {
  title: string;
  value: string;
  icon: string;
  color: string;
  onPress?: () => void;
}

const MetricsCard: React.FC<MetricsCardProps> = ({
  title,
  value,
  icon,
  color,
  onPress,
}) => {
  const isLoading = value === 'loading';

  const renderIcon = () => {
    const iconSize = 24;
    const iconProps = { size: iconSize, color };

    switch (icon) {
      case 'users':
        return <Users {...iconProps} />;
      case 'file-text':
        return <FileText {...iconProps} />;
      case 'clock':
        return <Clock {...iconProps} />;
      case 'calendar':
        return <Calendar {...iconProps} />;
      default:
        return <Users {...iconProps} />;
    }
  };

  const content = (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>{renderIcon()}</View>
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.valueContainer}>
        {isLoading ? (
          <ActivityIndicator size="small" color={color} />
        ) : (
          <Text style={[styles.value, { color }]}>{value}</Text>
        )}
      </View>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f8f8f8',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 16,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
    flex: 1,
  },
  valueContainer: {
    minHeight: 40,
    justifyContent: 'center',
  },
  value: {
    fontSize: 32,
    fontWeight: '700',
  },
});

export default MetricsCard;
