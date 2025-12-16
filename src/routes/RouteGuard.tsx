import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { authorizedRoutes, nonAuthRoutes } from './routeConfig';
import useAuth from '../hooks/useAuth';
import AuthenticatedLayout from '../components/layout/AuthenticatedLayout';

const Stack = createNativeStackNavigator();

const AuthenticatedStack = ({ navigation }: any) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {authorizedRoutes.map(route => (
        <Stack.Screen key={route.name} name={route.name}>
          {props => (
            <AuthenticatedLayout
              breadcrumbs={route.breadcrumbs}
              navigation={props.navigation}
            >
              <route.component {...props} />
            </AuthenticatedLayout>
          )}
        </Stack.Screen>
      ))}
    </Stack.Navigator>
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
        <Stack.Screen name="Main" component={AuthenticatedStack} />
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
