import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { Client } from '../../types';

interface ClientCardProps {
  client: Client;
  onPress: () => void;
}

const ClientCard: React.FC<ClientCardProps> = ({ client, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View
        style={[
          styles.avatar,
          {
            backgroundColor: '#5555550D',
          },
        ]}
      >
        <Text style={[styles.initials, { color: client.color }]}>
          {client.initials}
        </Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {client.name}
        </Text>
        <Text style={styles.email} numberOfLines={1}>
          {client.email}
        </Text>
      </View>
      <ChevronRight size={20} color="#94a3b8" style={styles.arrow} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f6f7f7',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    fontSize: 18,
    fontWeight: '600',
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 2,
  },
  email: {
    fontSize: 14,
    color: '#64748b',
  },
  arrow: {
    flexShrink: 0,
  },
});

export default ClientCard;
