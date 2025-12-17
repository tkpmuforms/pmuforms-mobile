import { NavigatorScreenParams } from '@react-navigation/native';
import { ClientDetail } from './index';

export type RootStackParamList = {
  // Auth
  Auth: undefined;

  // Main Tabs
  Dashboard: undefined;
  Appointments: undefined;
  Clients: undefined;
  Forms: undefined;
  Profile: undefined;

  // Client Screens
  ClientDetails: { clientId: string };
  ClientAppointments: { clientId: string; client?: ClientDetail };
  ClientNotes: { clientId: string; client?: ClientDetail };
  ClientReminders: { clientId: string; client?: ClientDetail };

  // Form Screens
  FormPreview: { formId: string };

  // Other Screens
  // Add more routes as needed
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
