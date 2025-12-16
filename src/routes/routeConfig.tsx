import React from 'react';
import AuthScreen from '../screens/auth/Auth';
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import ClientScreen from '../screens/client/ClientScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import FormsScreen from '../screens/forms/FormsScreen';
import PreviewFormsScreen from '../screens/forms/PreviewFormsScreen';
import AppointmentsScreen from '../screens/appointments/AppointmentsScreen';

// Screens that don't exist yet - uncomment when created
// import ClientDetailsScreen from '../screens/client/ClientDetailsScreen';
// import ClientAppointmentsScreen from '../screens/client/ClientAppointmentsScreen';
// import ClientNotesScreen from '../screens/client/ClientNotesScreen';
// import ClientRemindersScreen from '../screens/client/ClientRemindersScreen';
// import AppointmentFormsScreen from '../screens/appointments/AppointmentFormsScreen';
// import FilledFormsPreviewScreen from '../screens/appointments/FilledFormsPreviewScreen';
// import SignatureScreen from '../screens/appointments/SignatureScreen';
// import EditFormsScreen from '../screens/forms/EditFormsScreen';
// import EditProfileScreen from '../screens/profile/EditProfileScreen';
// import BusinessInformationScreen from '../screens/profile/BusinessInformationScreen';
// import IntegrationsScreen from '../screens/profile/IntegrationsScreen';
// import PaymentScreen from '../screens/profile/PaymentScreen';
// import ContactUsScreen from '../screens/support/ContactUsScreen';
// import PrivacyPolicyScreen from '../screens/support/PrivacyPolicyScreen';

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
  // {
  //   name: 'ClientDetails',
  //   component: ClientDetailsScreen,
  //   breadcrumbs: ['Clients', 'Client Details'],
  // },
  // {
  //   name: 'ClientReminders',
  //   component: ClientRemindersScreen,
  //   breadcrumbs: ['Clients', 'Client Details', 'Reminders'],
  // },
  // {
  //   name: 'ClientAppointments',
  //   component: ClientAppointmentsScreen,
  //   breadcrumbs: ['Clients', 'Client Details', 'Appointments'],
  // },
  // {
  //   name: 'AppointmentForms',
  //   component: AppointmentFormsScreen,
  //   breadcrumbs: ['Clients', 'Client Details', 'Appointments', 'Forms'],
  // },
  // {
  //   name: 'ClientNotes',
  //   component: ClientNotesScreen,
  //   breadcrumbs: ['Clients', 'Client Details', 'Notes'],
  // },
  // {
  //   name: 'AppointmentSignature',
  //   component: SignatureScreen,
  //   breadcrumbs: ['Clients', 'Client Details', 'Appointments', 'Signature'],
  // },
  // {
  //   name: 'FilledFormPreview',
  //   component: FilledFormsPreviewScreen,
  //   breadcrumbs: [
  //     'Clients',
  //     'Client Details',
  //     'Appointments',
  //     'Forms',
  //     'Filled Form Preview',
  //   ],
  // },
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
  // {
  //   name: 'FormEdit',
  //   component: EditFormsScreen,
  //   breadcrumbs: ['Forms', 'Edit Form'],
  // },
  {
    name: 'Profile',
    component: ProfileScreen,
    breadcrumbs: ['Profile'],
  },
  // {
  //   name: 'EditProfile',
  //   component: EditProfileScreen,
  //   breadcrumbs: ['Profile', 'Edit Profile'],
  // },
  // {
  //   name: 'BusinessInformation',
  //   component: BusinessInformationScreen,
  //   breadcrumbs: ['Profile', 'Business Information'],
  // },
  // {
  //   name: 'Integrations',
  //   component: IntegrationsScreen,
  //   breadcrumbs: ['Profile', 'Integrations'],
  // },
  // {
  //   name: 'Payment',
  //   component: PaymentScreen,
  //   breadcrumbs: ['Profile', 'Payment'],
  // },
  // {
  //   name: 'ContactUs',
  //   component: ContactUsScreen,
  //   breadcrumbs: ['Profile', 'Contact Us'],
  // },
  // {
  //   name: 'PrivacyPolicy',
  //   component: PrivacyPolicyScreen,
  //   breadcrumbs: ['Profile', 'Privacy Policy'],
  // },
];

export const nonAuthRoutes: RouteProps[] = [
  {
    name: 'Auth',
    component: AuthScreen,
    breadcrumbs: [],
  },
];
