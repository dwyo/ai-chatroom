import axios from 'axios';

const API_URL = '/api';

export interface AuthResponse {
  data: {
    token: string;
    user: {
      id: string;
      username: string;
      email: string;
    };    
  };
}

export interface LoginData {
  identity: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const login = async (data: LoginData): Promise<AuthResponse> => {
  const response = await axios.post(`${API_URL}/auth/login`, data);
  return response.data;
};

export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await axios.post(`${API_URL}/auth/register`, data);
  return response.data;
};