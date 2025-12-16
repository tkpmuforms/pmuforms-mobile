import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

interface ClientScreenProps {
  // Add your props here
}

const ClientScreen: React.FC<ClientScreenProps> = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Client Screen</Text>
        <Text style={styles.subtitle}>Welcome to your app</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});

export default ClientScreen;