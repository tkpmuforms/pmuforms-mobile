import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { UserPlus, FileText, Send } from 'lucide-react-native';

interface QuickActionCardProps {
  title: string;
  icon: string;
  onPress: () => void;
}

const QuickActionCard: React.FC<QuickActionCardProps> = ({
  title,
  icon,
  onPress,
}) => {
  const renderIcon = () => {
    const iconSize = 24;
    const iconColor = '#fff';

    switch (icon) {
      case 'user-plus':
        return <UserPlus size={iconSize} color={iconColor} />;
      case 'file-text':
        return <FileText size={iconSize} color={iconColor} />;
      case 'send':
        return <Send size={iconSize} color={iconColor} />;
      default:
        return <UserPlus size={iconSize} color={iconColor} />;
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.iconContainer}>{renderIcon()}</View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8f8f8',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    gap: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1e293b',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#A858F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default QuickActionCard;
