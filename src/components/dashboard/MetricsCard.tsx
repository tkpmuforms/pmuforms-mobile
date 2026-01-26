import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
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
    <View style={[styles.card, { backgroundColor: `${color}15` }]}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: `${color}25` }]}>
          {renderIcon()}
        </View>
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
    borderRadius: 16,
    padding: 16,
    minHeight: 120,
    justifyContent: 'space-between',
  },
  header: {
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 13,
    fontWeight: '500',
    color: '#000000',
    flex: 1,
  },
  valueContainer: {
    minHeight: 32,
    justifyContent: 'center',
  },
  value: {
    fontSize: 28,
    fontWeight: '700',
  },
});

export default MetricsCard;
