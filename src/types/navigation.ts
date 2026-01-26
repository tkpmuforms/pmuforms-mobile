import { ClientDetail, Note } from './index';

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
  AddClient: undefined;
  SendConsentForm: { clientId: string; clientName: string };
  EditClient: { clientId: string; client: ClientDetail };
  EditBusinessInformation: undefined;
  AddNote: {
    clientId: string;
    note?: Note;
    onSave?: (noteContent: string, imageUrl?: string) => Promise<void>;
  };
  AddReminder: {
    clientId: string;
    clientName?: string;
  };
  AddCard: {
    onCardAdded?: () => void;
  };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
