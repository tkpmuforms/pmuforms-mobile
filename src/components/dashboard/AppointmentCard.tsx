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
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: avatar || 'https://via.placeholder.com/40' }}
            style={styles.avatar}
          />
        </View>
        <Text style={styles.name}>{name}</Text>
      </View>

      <View style={styles.infoRow}>
        <Briefcase size={16} color="#424242" style={styles.icon} />
        <Text style={styles.infoText}>{service}</Text>
      </View>

      <View style={styles.infoRow}>
        <Clock size={16} color="#424242" style={styles.icon} />
        <Text style={styles.infoText}>{time}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.buttonText}>View Full Schedule</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  avatarContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    flex: 1,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 8,
  },
  icon: {
    opacity: 0.7,
  },
  infoText: {
    fontSize: 14,
    color: '#424242',
    fontWeight: '500',
  },
  button: {
    marginTop: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#A858F0',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default AppointmentCard;
