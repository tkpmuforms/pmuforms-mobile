import { colors } from '../theme/colors';
import { Form, User } from '../types';

export const getCustomerName = (
  customerId: string,
  customers: Record<string, { name: string; avatar?: string }>,
) => customers[customerId]?.name || 'Client 1';

export const getCustomerAvatar = (
  customerId: string,
  customers: Record<string, { name: string; avatar?: string }>,
) => {
  const customerAvatar = customers[customerId]?.avatar;
  if (customerAvatar) return customerAvatar;

  const customerName = customers[customerId]?.name || 'Unknown Client';
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    customerName,
  )}&background=A858F0&color=fff&size=40`;
};

export const generateColor = (name: string): string => {
  const colors = [
    '#e879f9',
    '#3b82f6',
    '#10b981',
    '#f59e0b',
    '#ef4444',
    '#8b5cf6',
    '#06b6d4',
    '#f97316',
  ];

  if (!name || name.length === 0) {
    return colors[0];
  }

  const index = (name.length + name.charCodeAt(0)) % colors.length;
  return colors[index];
};

export const generateInitials = (name: string): string => {
  if (!name || name.trim().length === 0) {
    return 'N/A';
  }

  return name
    .split(' ')
    .filter(word => word.length > 0)
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
};

export const formatAppointmentTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

export const formatLastUpdated = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    return 'Updated 1 day ago';
  } else if (diffDays < 7) {
    return `Updated ${diffDays} days ago`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return weeks === 1 ? 'Updated 1 week ago' : `Updated ${weeks} weeks ago`;
  } else {
    const months = Math.floor(diffDays / 30);
    return months === 1
      ? 'Updated 1 month ago'
      : `Updated ${months} months ago`;
  }
};

export const formatUsedFor = (services: number[]): string => {
  const count = services.length;
  return count === 1 ? 'Used for 1 Service' : `Used for ${count} Services`;
};

export const transformFormData = (apiForm: any): Form => {
  return {
    id: apiForm.id || apiForm._id,
    title: apiForm.title,
    lastUpdated: formatLastUpdated(apiForm.updatedAt),
    usedFor: formatUsedFor(apiForm.services || []),
    type: apiForm.type as 'consent' | 'care',
    services: apiForm.services || [],
    createdAt: apiForm.createdAt,
    updatedAt: apiForm.updatedAt,
  };
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const getCardColor = (brand: string): string => {
  const colors: { [key: string]: string } = {
    visa: '#1A1F71',
    mastercard: '#EB001B',
    amex: '#006FCF',
    unionpay: '#00447C',
  };
  return colors[brand.toLowerCase()] || '#6B2A6B';
};

export const getCardLogo = (brand: string): string | null => {
  const logos: { [key: string]: string } = {
    visa: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 32'%3E%3Cpath fill='%23fff' d='M20.5 10h-3.8L13.2 22h2.6l.7-1.9h2.3l.4 1.9h2.8L20.5 10zm-2.8 7.5l.9-4.8.5 4.8h-1.4zm8.1-7.5h-2.5L20 22h2.5l3.3-12zm7.5 0h-2.5l-4.1 12h2.5l.9-2.7h3l.4 2.7h2.4l-2.6-12zm-2.2 7.5l1.2-5.2.6 5.2h-1.8zm7.9-7.5l-3.1 8.6-.3-1.7-.9-4.6c-.1-.7-.7-1.2-1.5-1.2h-4.1l-.1.4c1 .2 2 .5 2.8 1l2.4 9.1h2.6L40 10h-2.0z'/%3E%3C/svg%3E",
    mastercard:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 32'%3E%3Ccircle cx='15' cy='16' r='8' fill='%23EB001B'/%3E%3Ccircle cx='25' cy='16' r='8' fill='%23FF5F00'/%3E%3Cpath fill='%23F79E1B' d='M20 9.5a8 8 0 000 13 8 8 0 000-13z'/%3E%3C/svg%3E",
    amex: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 32'%3E%3Cpath fill='%23fff' d='M10 12h2.5l.8 2 .8-2H17l-2 4 2 4h-2.5l-.8-2-.8 2H10l2-4-2-4zm8 0h6v1.5h-4v1h4v1.5h-4v1h4V19h-6v-7zm8 0h2l1.5 5 1.5-5h2v7h-1.5v-5.5L29 19h-1l-1.5-5.5V19H25v-7zm10 0h2v5.5h3V19h-5v-7z'/%3E%3C/svg%3E",
    unionpay:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 32'%3E%3Cpath fill='%23fff' d='M12 14h2l1 3 1-3h2v5h-1v-4l-1 4h-1l-1-4v4h-2v-5zm7 0h3v1h-2v1h2v1h-2v1h2v1h-3v-5zm5 0h1l2 3v-3h1v5h-1l-2-3v3h-1v-5zm5 0h1v4h2v1h-3v-5z'/%3E%3C/svg%3E",
  };
  return logos[brand.toLowerCase()] || null;
};

export const getTransactionStatus = (
  status: string,
): 'Successful' | 'Failed' | 'Pending' => {
  if (status === 'succeeded' || status === 'paid') return 'Successful';
  if (status === 'failed') return 'Failed';
  return 'Pending';
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'Successful':
      return '#10B981';
    case 'Failed':
      return '#EF4444';
    case 'Pending':
      return '#F59E0B';
    default:
      return '#6B7280';
  }
};

export const getAvatarUrl = (user: User) => {
  if (user?.avatarUrl) return user.avatarUrl;
  const name = user?.businessName || 'User';
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name,
  )}&background=${colors.avatarBackground.replace(
    '#',
    '',
  )}&color=${colors.primary.replace('#', '')}&size=120`;
};
