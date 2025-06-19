export enum CreditRequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export interface Money {
  amount: number;
  currency: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: number;
  createdAt: string;
  lastLoginAt: string;
  isActive: boolean;
  updatedAt: string;
}

export interface CreateCreditRequestRequest {
  amount: number;
  purpose: string;
  termInMonths: number;
  monthlyIncome: number;
  workExperience: number;
  currency: string;
  monthlyIncomeCurrency: string;
}

export interface CreditRequestResponse {
  id: string;
  userId: string;
  user: User;
  amount: Money;
  termInMonths: number;
  monthlyIncome: Money;
  workSeniorityYears: number;
  purpose: string;
  status: string;
  rejectionReason: string;
  approvedBy: string;
  approvedAt: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface UpdateCreditRequestStatusRequest {
  status: CreditRequestStatus;
  rejectionReason?: string;
}

export interface CreditRequestListResponse {
  id: string;
  userId: string;
  user: User;
  amount: Money;
  termInMonths: number;
  monthlyIncome: Money;
  workSeniorityYears: number;
  purpose: string;
  status: string;
  rejectionReason: string;
  approvedBy: string;
  approvedAt: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface CreditRequestFilter {
  status?: CreditRequestStatus;
}

export interface PaginatedCreditRequests {
  items: CreditRequestListResponse[];
  page: number;
  size: number;
  totalCount: number;
  totalPages: number;
}

export const formatCurrency = (
  amount: number,
  currency: string = 'USD'
): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const STATUS_TRANSLATIONS: { [key: string]: string } = {
  pending: 'Pendiente',
  approved: 'Aprobado',
  rejected: 'Rechazado',
};

export const translateStatus = (status: string): string => {
  const normalizedStatus = status.toLowerCase();
  return STATUS_TRANSLATIONS[normalizedStatus] || status;
};

export function getNormalizedStatus(
  status: string
): 'Pending' | 'Approved' | 'Rejected' {
  if (!status) return 'Pending';
  const s = status.toLowerCase();
  if (s === 'pending') return 'Pending';
  if (s === 'approved') return 'Approved';
  if (s === 'rejected') return 'Rejected';
  return 'Pending';
}

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'Approved':
      return 'success';
    case 'Rejected':
      return 'error';
    default:
      return 'primary';
  }
};
