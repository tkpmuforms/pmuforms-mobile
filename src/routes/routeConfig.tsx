import AuthScreen from '../screens/auth/Auth';
import DashboardScreen from '../screens/dashboard/DashboardScreen';

interface RouteProps {
  name: string;
  component: React.ComponentType<any>;
  breadcrumbs?: string[];
  showAds?: boolean;
}

export const authorizedRoutes: RouteProps[] = [
  {
    name: 'Dashboard',
    component: DashboardScreen,
  },
];

export const nonAuthRoutes: RouteProps[] = [
  {
    name: 'Auth',
    component: AuthScreen,
  },
];
