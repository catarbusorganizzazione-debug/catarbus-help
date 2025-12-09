export interface LoginRequest {
  username: string;
  password: string; // Password in chiaro che verrà hashata
}

export interface LoginResponse {
  success: boolean;
  message?: string;
  user?: {
    id: string;
    user: string;
    name: string;
    role: 'admin' | 'manager';
  };
  token?: string;
}

export interface ApiError {
  success: false;
  message: string;
  error?: string;
}