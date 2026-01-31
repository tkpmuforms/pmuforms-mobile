import React from 'react';
import AppointmentsScreen from '../screens/appointments/AppointmentsScreen';
import AuthScreen from '../screens/auth/Auth';
import AddClientScreen from '../screens/client/AddClientScreen';
import ClientAppointmentsScreen from '../screens/client/ClientAppointmentsScreen';
import ClientDetailsScreen from '../screens/client/ClientDetailsScreen';
import ClientNotesScreen from '../screens/client/ClientNotesScreen';
import ClientRemindersScreen from '../screens/client/ClientRemindersScreen';
import ClientScreen from '../screens/client/ClientScreen';
import EditClientScreen from '../screens/client/EditClientScreen';
import SendConsentFormScreen from '../screens/client/SendConsentFormScreen';
import AddNoteScreen from '../screens/client/AddNoteScreen';
import AddReminderScreen from '../screens/client/AddReminderScreen';
import AddCardScreen from '../screens/payment/AddCardScreen';
import EditBusinessInformationScreen from '../screens/profile/EditBusinessInformationScreen';
import FilledFormsPreviewScreen from '../screens/client/FilledFormsPreviewScreen';
import SignatureScreen from '../screens/client/SignatureScreen';
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import EditFormsScreen from '../screens/forms/EditFormsScreen';
import FormsScreen from '../screens/forms/FormsScreen';
import PreviewFormsScreen from '../screens/forms/PreviewFormsScreen';
import BusinessInformationScreen from '../screens/profile/BusinessInformationScreen';
import EditProfileScreen from '../screens/profile/EditProfileScreen';
import PaymentScreen from '../screens/profile/PaymentScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import ContactSupportScreen from '../screens/support/ContactSupportScreen';
import PrivacyPolicyScreen from '../screens/support/PrivacyPolicyScreen';
import BusinessNameScreen from '../screens/onboarding/BusinessNameScreen';
import ServicesSelectionScreen from '../screens/onboarding/ServicesSelectionScreen';
import PaymentSetupScreen from '../screens/onboarding/PaymentSetupScreen';

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
    breadcrumbs: ['Dashboard'],
  },
  {
    name: 'Appointments',
    component: AppointmentsScreen,
    breadcrumbs: ['Dashboard', 'Appointments'],
  },
  {
    name: 'Clients',
    component: ClientScreen,
    breadcrumbs: ['Clients'],
  },
  {
    name: 'ClientDetails',
    component: ClientDetailsScreen,
    breadcrumbs: ['Clients', 'Client Details'],
  },
  {
    name: 'ClientReminders',
    component: ClientRemindersScreen,
    breadcrumbs: ['Clients', 'Client Details', 'Reminders'],
  },
  {
    name: 'ClientAppointments',
    component: ClientAppointmentsScreen,
    breadcrumbs: ['Clients', 'Client Details', 'Appointments'],
  },
  {
    name: 'ClientNotes',
    component: ClientNotesScreen,
    breadcrumbs: ['Clients', 'Client Details', 'Notes'],
  },
  {
    name: 'AppointmentSignature',
    component: SignatureScreen,
    breadcrumbs: ['Clients', 'Client Details', 'Appointments', 'Signature'],
  },
  {
    name: 'FilledFormsPreview',
    component: FilledFormsPreviewScreen,
    breadcrumbs: [
      'Clients',
      'Client Details',
      'Appointments',
      'Forms',
      'Filled Form Preview',
    ],
  },
  {
    name: 'Forms',
    component: FormsScreen,
    breadcrumbs: ['Forms'],
  },
  {
    name: 'FormPreview',
    component: PreviewFormsScreen,
    breadcrumbs: ['Forms', 'Preview Form'],
  },
  {
    name: 'FormEdit',
    component: EditFormsScreen,
    breadcrumbs: ['Forms', 'Edit Form'],
  },
  {
    name: 'Profile',
    component: ProfileScreen,
    breadcrumbs: ['Profile'],
  },
  {
    name: 'ContactSupport',
    component: ContactSupportScreen,
    breadcrumbs: ['Profile', 'Contact Support'],
  },
  {
    name: 'PrivacyPolicy',
    component: PrivacyPolicyScreen,
    breadcrumbs: ['Privacy Policy'],
  },
  {
    name: 'EditProfile',
    component: EditProfileScreen,
    breadcrumbs: ['Profile', 'Edit Profile'],
  },
  {
    name: 'BusinessInformation',
    component: BusinessInformationScreen,
    breadcrumbs: ['Profile', 'Business Information'],
  },
  {
    name: 'Payment',
    component: PaymentScreen,
    breadcrumbs: ['Profile', 'Payment'],
  },
  {
    name: 'AddClient',
    component: AddClientScreen,
    breadcrumbs: ['Clients', 'Add Client'],
  },
  {
    name: 'SendConsentForm',
    component: SendConsentFormScreen,
    breadcrumbs: ['Clients', 'Send Consent Form'],
  },
  {
    name: 'EditClient',
    component: EditClientScreen,
    breadcrumbs: ['Clients', 'Client Details', 'Edit Client'],
  },
  {
    name: 'EditBusinessInformation',
    component: EditBusinessInformationScreen,
    breadcrumbs: ['Profile', 'Business Information', 'Edit'],
  },
  {
    name: 'AddNote',
    component: AddNoteScreen,
    breadcrumbs: ['Clients', 'Client Details', 'Notes', 'Add Note'],
  },
  {
    name: 'AddReminder',
    component: AddReminderScreen,
    breadcrumbs: ['Clients', 'Client Details', 'Reminders', 'Add Reminder'],
  },
  {
    name: 'AddCard',
    component: AddCardScreen,
    breadcrumbs: ['Profile', 'Payment', 'Add Card'],
  },
];

export const nonAuthRoutes: RouteProps[] = [
  {
    name: 'Auth',
    component: AuthScreen,
    breadcrumbs: [],
  },
];

export const onboardingRoutes: RouteProps[] = [
  {
    name: 'OnboardingBusinessName',
    component: BusinessNameScreen,
    breadcrumbs: ['Onboarding', 'Business Information'],
  },
  {
    name: 'OnboardingServices',
    component: ServicesSelectionScreen,
    breadcrumbs: ['Onboarding', 'Services'],
  },
  {
    name: 'OnboardingPayment',
    component: PaymentSetupScreen,
    breadcrumbs: ['Onboarding', 'Payment'],
  },
];
