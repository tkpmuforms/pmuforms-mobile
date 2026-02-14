import { ClientAppointmentData, ClientDetail, FilledForm, Note } from './index';

export type RootStackParamList = {
  Auth: undefined;
  Dashboard: undefined;
  Appointments: undefined;
  Clients: undefined;
  Forms: undefined;
  Profile: undefined;
  ClientDetails: { clientId: string };
  ClientAppointments: { clientId: string; client?: ClientDetail };
  ClientAppointmentForms: {
    clientId: string;
    appointmentId: string;
    clientName?: string;
    appointments?: ClientAppointmentData[];
  };
  AppointmentSignature: {
    appointmentId: string;
    clientId: string;
    clientName: string;
    forms: FilledForm[];
    appointments: any[];
  };
  FilledFormsPreview: {
    appointmentId: string;
    templateId: string;
    clientId?: string;
  };
  ClientNotes: { clientId: string; client?: ClientDetail };
  ClientReminders: { clientId: string; client?: ClientDetail };
  FormPreview: { formId: string };
  FormEdit: { formId: string };
  AddField: {
    formId: string;
    sectionId: string;
    afterFieldId: string;
  };
  FieldInput: {
    formId: string;
    sectionId: string;
    afterFieldId: string;
    fieldType: { type: string; title: string };
    fieldId?: string;
    initialTitle?: string;
    initialRequired?: boolean;
    fieldLine?: string;
  };
  EditParagraph: {
    formId: string;
    sectionId: string;
    afterFieldId: string;
    fieldId?: string;
    initialContent?: string;
    initialRequired?: boolean;
    fieldLine?: string;
  };
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
    reminder?: import('./index').Reminder;
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
