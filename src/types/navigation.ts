import { ClientDetail } from './index';

export type RootStackParamList = {
  Auth: undefined;
  Dashboard: undefined;
  Appointments: undefined;
  Clients: undefined;
  Forms: undefined;
  Profile: undefined;
  ClientDetails: { clientId: string };
  ClientAppointments: { clientId: string; client?: ClientDetail };
  ClientNotes: { clientId: string; client?: ClientDetail };
  ClientReminders: { clientId: string; client?: ClientDetail };
  FormPreview: { formId: string };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
