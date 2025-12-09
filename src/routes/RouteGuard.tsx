import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { authorizedRoutes, nonAuthRoutes } from './routeConfig';
import useAuth from '../hooks/useAuth';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const AuthenticatedDrawer = () => {
  return (
    <Drawer.Navigator screenOptions={{ headerShown: false }}>
      {authorizedRoutes.map(route => (
        <Drawer.Screen
          key={route.name}
          name={route.name}
          component={route.component}
        />
      ))}
    </Drawer.Navigator>
  );
};

const RouteGuard = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <>
          {nonAuthRoutes.map(route => (
            <Stack.Screen
              key={route.name}
              name={route.name}
              component={route.component}
            />
          ))}
        </>
      ) : (
        <Stack.Screen name="Main" component={AuthenticatedDrawer} />
      )}
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default RouteGuard;
