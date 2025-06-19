export interface User {
  username: string;
  email: string;
  role: string; // 'User' | 'Analyst' | 'Admin'
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  email: string;
  role: string;
}

export const ROLE_TRANSLATIONS: { [key: string]: string } = {
  user: 'Solicitante',
  analyst: 'Analista',
  admin: 'Administrador',
};

export const translateRole = (role: string): string => {
  const normalizedRole = role.toLowerCase();
  return ROLE_TRANSLATIONS[normalizedRole] || role;
};
