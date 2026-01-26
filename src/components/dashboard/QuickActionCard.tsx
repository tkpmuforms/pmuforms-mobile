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
  const getIconBackgroundColor = () => {
    switch (icon) {
      case 'user-plus':
        return '#34C771';
      case 'file-text':
        return '#E25FE2';
      case 'send':
        return '#FFBC44';
      default:
        return '#34C771';
    }
  };

  const renderIcon = () => {
    const iconSize = 18;
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
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: getIconBackgroundColor() },
        ]}
      >
        {renderIcon()}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 14,
    color: '#000000',
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default QuickActionCard;
