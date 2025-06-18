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
