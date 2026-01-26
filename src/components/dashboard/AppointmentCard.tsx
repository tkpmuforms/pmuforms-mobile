import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Clock, Briefcase } from 'lucide-react-native';

interface AppointmentCardProps {
  name?: string;
  avatar?: string;
  time?: string;
  service?: string;
  onPress?: () => void;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  name,
  avatar,
  time,
  service,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: avatar || 'https://via.placeholder.com/40' }}
            style={styles.avatar}
          />
        </View>
        <Text style={styles.name}>{name}</Text>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Briefcase size={12} color="#424242" style={styles.icon} />
          <Text style={styles.infoText}>{service}</Text>
        </View>
        <View style={styles.infoRow}>
          <Clock size={12} color="#424242" style={styles.icon} />
          <Text style={styles.infoText}>{time}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    flex: 1,
  },
  infoContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  icon: {
    opacity: 0.7,
  },
  infoText: {
    fontSize: 13,
    color: '#5D5D5D',
    fontWeight: '300',
  },
});

export default AppointmentCard;
