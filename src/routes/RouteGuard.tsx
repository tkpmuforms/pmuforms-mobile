import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  LayoutDashboard,
  Users,
  FileText,
  UserCircle,
} from 'lucide-react-native';
import { authorizedRoutes, nonAuthRoutes } from './routeConfig';
import useAuth from '../hooks/useAuth';
import AuthenticatedLayout from '../components/layout/AuthenticatedLayout';
import { colors } from '../theme/colors';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const mainTabRoutes = ['Dashboard', 'Clients', 'Forms', 'Profile'];

const getTabIcon = (routeName: string, focused: boolean) => {
  const iconColor = focused ? colors.primary : colors.textLight;
  const iconSize = 24;

  switch (routeName) {
    case 'Dashboard':
      return <LayoutDashboard size={iconSize} color={iconColor} />;
    case 'Clients':
      return <Users size={iconSize} color={iconColor} />;
    case 'Forms':
      return <FileText size={iconSize} color={iconColor} />;
    case 'Profile':
      return <UserCircle size={iconSize} color={iconColor} />;
    default:
      return <LayoutDashboard size={iconSize} color={iconColor} />;
  }
};

const AuthenticatedTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused }) => getTabIcon(route.name, focused),
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLight,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: colors.border,
          paddingBottom: 25,
          paddingTop: 8,
          height: 80,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      })}
    >
      {authorizedRoutes
        .filter(route => mainTabRoutes.includes(route.name))
        .map(route => (
          <Tab.Screen key={route.name} name={route.name}>
            {props => (
              <AuthenticatedLayout
                breadcrumbs={route.breadcrumbs}
                navigation={props.navigation}
              >
                <route.component {...props} />
              </AuthenticatedLayout>
            )}
          </Tab.Screen>
        ))}
    </Tab.Navigator>
  );
};

const AuthenticatedStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Tabs" component={AuthenticatedTabs} />
      {/* Other non-tab screens */}
      {authorizedRoutes
        .filter(route => !mainTabRoutes.includes(route.name))
        .map(route => (
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
        <ActivityIndicator size="large" color="#8e2d8e" />
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
