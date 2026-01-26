import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import {
  HomeIcon,
  HomeActiveIcon,
  ClientsIcon,
  ClientsActiveIcon,
  FormsActiveIcon,
  FormIcon,
  ProfileIcon,
  ProfileActiveIcon,
} from '../../assets/svg';
import AuthenticatedLayout from '../components/layout/AuthenticatedLayout';
import useAuth from '../hooks/useAuth';
import { colors } from '../theme/colors';
import { authorizedRoutes, nonAuthRoutes } from './routeConfig';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const mainTabRoutes = ['Dashboard', 'Clients', 'Forms', 'Profile'];

const getTabIcon = (routeName: string, focused: boolean) => {
  const iconSize = { width: 50, height: 50 };
  const activeIconSize = { width: 80, height: 80 };

  switch (routeName) {
    case 'Dashboard':
      return focused ? (
        <HomeActiveIcon {...activeIconSize} />
      ) : (
        <HomeIcon {...iconSize} />
      );
    case 'Clients':
      return focused ? (
        <ClientsActiveIcon {...activeIconSize} />
      ) : (
        <ClientsIcon {...iconSize} />
      );
    case 'Forms':
      return focused ? (
        <FormsActiveIcon {...activeIconSize} />
      ) : (
        <FormIcon {...iconSize} />
      );
    case 'Profile':
      return focused ? (
        <ProfileActiveIcon {...activeIconSize} />
      ) : (
        <ProfileIcon {...iconSize} />
      );
    default:
      return focused ? (
        <HomeActiveIcon {...activeIconSize} />
      ) : (
        <HomeIcon {...iconSize} />
      );
  }
};

const AuthenticatedTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused }) => getTabIcon(route.name, focused),
        tabBarShowLabel: false,
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
