import axiosInstance from "../utils/axiosSetup";


export const createArtist = async (accessToken: string) =>
  axiosInstance.post('/api/auth/artist/create', { accessToken });

export const updateServices = async (data: { services: number[] }) =>
  axiosInstance.put('/api/services/update-services', data);

export const getServices = async () => axiosInstance.get('/api/services');

export const getServiceById = async (serviceId: number | string) =>
  axiosInstance.get(`/api/services/${serviceId}`);

export const getAuthMe = async () => axiosInstance.get('/api/auth/me');

export const updateBusinessName = async (data: { businessName: string }) =>
  axiosInstance.patch('/api/artists/update-business-name', data);

export const sendEmailVerification = async (uid: string) =>
  axiosInstance.get(`/api/auth/send-email-verification/${uid}`);

export const getAppointmentsForCustomer = async (customerId: string) =>
  axiosInstance.get(`/api/appointments/artist/one-customer/${customerId}`);

export const getArtistAppointments = async () =>
  axiosInstance.get('/api/appointments/artist');

export const getArtistAppointmentsPaginated = async (
  page: number = 1,
  perPage: number = 10
) => {
  return axiosInstance.get(
    `/api/appointments/artist?page=${page}&perPage=${perPage}`
  );
};

export const bookAppointment = async (data: {
  appointmentDate: string;
  customerId: string;
  services: number[];
}) =>
  axiosInstance.post(
    '/api/appointments/artist/book-appointment?notify_customer=1',
    data
  );

export const sendMessage = async (data: {
  email: string;
  firstName: string;
  subject: string;
  message: string;
}) => axiosInstance.post('/api/messages', data);

export const getFilledFormsByAppointment = async (
  appointmentId: string | number
) => axiosInstance.get(`/api/filled-forms/appointment/${appointmentId}`);

export const getFilledFormByAppointmentAndTemplate = async (
  appointmentId: string,
  formTemplateId: string
) =>
  axiosInstance.get(
    `/api/filled-forms/appointment/${appointmentId}/form/${formTemplateId}`
  );

export const getFormsByAppointment = async (appointmentId: string | number) =>
  axiosInstance.get(`/api/forms/appointment/${appointmentId}`);

export const getFormById = async (formTemplateId: string | number) =>
  axiosInstance.get(`/api/forms/${formTemplateId}`);

export const updateFormServices = async (
  formTemplateId: string | number,
  data: { services: number[] }
) => axiosInstance.put(`/api/forms/${formTemplateId}/update-services`, data);

export const getMyForms = async () => axiosInstance.get('/forms/my-forms');

export const deleteFormTemplate = async (formTemplateId: string | number) =>
  axiosInstance.delete(`/api/forms/${formTemplateId}/delete`);

export const updateFormSectionData = async (
  formTemplateId: string | number,
  sectionId: string | number,
  dataId: string | number,
  data: Record<string, unknown>
) =>
  axiosInstance.patch(
    `/api/forms/${formTemplateId}/sections/${sectionId}/data/${dataId}/update`,
    data
  );

export const deleteFormSectionData = async (
  formTemplateId: string | number,
  sectionId: string | number,
  dataId: string | number
) =>
  axiosInstance.delete(
    `/api/forms/${formTemplateId}/sections/${sectionId}/data/${dataId}`
  );

export const addFormSectionData = async (
  formTemplateId: string | number,
  sectionId: string | number,
  data: Record<string, unknown>
) =>
  axiosInstance.post(
    `/api/forms/${formTemplateId}/sections/${sectionId}`,
    data
  );

export const updateArtistFcmToken = async (data: { fcmToken: string }) =>
  axiosInstance.patch('/api/artists/update-fcm-token', data);

export const getArtistById = async (artistId: string | number) =>
  axiosInstance.get(`/api/artists/${artistId}`);

export const getArtistUrl = async (artistId: string | number) =>
  axiosInstance.get(`/api/artists/${artistId}/url`);

export const deleteMe = async () =>
  axiosInstance.delete('/api/artists/delete-me');

export const signAppointment = async (
  appointmentId: string | number,
  data: { signatureUrl: string }
) => axiosInstance.post(`/api/appointments/${appointmentId}/sign`, data);

export const getMyCustomers = async (page?: number) => {
  const params = page ? `?page=${page}` : '';
  return axiosInstance.get(`/api/customers/my-customers${params}`);
};

export const getCustomerById = async (customerId: string) =>
  axiosInstance.get(`/api/customers/my-customers/${customerId}`);

export const deleteCustomer = async (customerId: string) =>
  axiosInstance.delete(`/api/customers/my-customers/${customerId}`);

export const addCustomerNote = async (
  customerId: string | number,
  data: { note: string; imageUrl?: string }
) =>
  axiosInstance.post(`/api/customers/my-customers/${customerId}/notes`, data);

export const getCustomerNotes = async (customerId: string) =>
  axiosInstance.get(`/api/customers/my-customers/${customerId}/notes`);

export const updateCustomerNote = async (
  customerId: string | number,
  noteId: string | number,
  data: { note: string; imageUrl?: string }
) =>
  axiosInstance.put(
    `/api/customers/my-customers/${customerId}/notes/${noteId}`,
    data
  );

export const deleteCustomerNote = async (
  customerId: string | number,
  noteId: string | number
) =>
  axiosInstance.delete(
    `/api/customers/my-customers/${customerId}/notes/${noteId}`
  );

export const searchCustomers = async (
  name?: string,
  page?: number,
  limit?: number
) => {
  const params = new URLSearchParams();
  if (name) params.append('name', name);
  if (page !== null && page !== undefined)
    params.append('page', page.toString());
  if (limit !== null && limit !== undefined)
    params.append('limit', limit.toString());

  const queryString = params.toString() ? `?${params.toString()}` : '';
  return axiosInstance.get(`/api/customers/my-customers/search${queryString}`);
};

export const updateCustomerPersonalDetails = async (
  customerId: string | number,
  data: {
    name: string;
    primaryPhone?: string;
    email?: string;
  }
) =>
  axiosInstance.patch(
    `/api/customers/my-customers/${customerId}/personal-details`,
    data
  );

export const getArtistForms = async () =>
  axiosInstance.get('/api/forms/my-forms');

export const createClient = async (data: {
  name: string;
  primaryPhone?: string;
  email?: string;
}) => axiosInstance.post('/api/customers/my-customers/create-customer', data);

export const getMyMetrics = async () =>
  axiosInstance.get('/api/artists/my-metrics');

export const DeleteAppointment = async (appointmentId: string) =>
  axiosInstance.delete(`/api/appointments/${appointmentId}`);

export const getCustomerMetrics = async (customerId: string) =>
  axiosInstance.get(`/api/customers/my-customers/${customerId}/metrics`);

export const createReminder = async (data: {
  sendAt: string;
  type: string;
  customerId: string | number;
  note: string;
}) => axiosInstance.post('/api/reminders/new-reminder', data);

export const getAllReminders = async () =>
  axiosInstance.get('/api/reminders/all-reminders');

export const getRemindersByCustomer = async (customerId: string) =>
  axiosInstance.get(`/api/reminders/customer/${customerId}`);

export const updateReminder = async (
  reminderId: string | number,
  data: {
    sendAt?: string;
    type?: string;
    note?: string;
  }
) => axiosInstance.patch(`/api/reminders/${reminderId}`, data);

export const deleteReminder = async (reminderId: string | number) =>
  axiosInstance.delete(`/api/reminders/${reminderId}`);

export const getMyServiceForms = async (services: number[]) => {
  const servicesParam = services.join(',');
  return axiosInstance.get(
    `/api/forms/my-service-forms?services=${servicesParam}`
  );
};

export const updateMyProfile = async (data: {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}) => axiosInstance.patch('/api/artists/my-profile/update', data);

export const getMyProfile = async () =>
  axiosInstance.get('/api/artists/my-profile');

export const getAppointmentById = async (appointmentId: string) =>
  axiosInstance.get(`/api/appointments/${appointmentId}`);

export const updateMySignature = async (data: { signature_url: string }) =>
  axiosInstance.patch('/api/artists/update-signature', data);

export const createSubscription = async (
  priceId: string,
  paymentMethodId: string
) => {
  return axiosInstance.post('/api/subscriptions/stripe/create-subscription', {
    priceId,
    paymentMethodId,
  });
};

export const cancelSubscription = async () => {
  return axiosInstance.get('/api/subscriptions/stripe/cancel-subscription');
};

export const getSubscription = async () => {
  return axiosInstance.get('/api/subscriptions/stripe/subscription-details');
};

export const changeSubscriptionPlan = async (
  newPriceId: string,
  paymentMethodId: string
) => {
  return axiosInstance.post(
    '/api/subscriptions/stripe/change-subscription-plan',
    {
      newPriceId,
      paymentMethodId,
    }
  );
};

export const listPaymentMethods = async () => {
  return axiosInstance.get('/api/subscriptions/stripe/list-payment-methods');
};

export const addPaymentMethod = async (paymentMethodId: string) => {
  return axiosInstance.post('/api/subscriptions/stripe/add-payment-method', {
    paymentMethodId,
  });
};

export const detachPaymentMethod = async (paymentMethodId: string) => {
  return axiosInstance.post('/api/subscriptions/stripe/detach-payment-method', {
    paymentMethodId,
  });
};

export const listTransactions = async () => {
  return axiosInstance.get('/api/subscriptions/stripe/list-transactions');
};

export const updateBusinessInfo = async (data: {
  businessName: string;
  businessPhoneNumber: string;
  businessAddress: string;
  website?: string;
}) => {
  return axiosInstance.patch('/api/artists/update-business-info', data);
};
