import api from './api';
import { LoginRequest, RegisterRequest, AuthResponse } from '../types/auth';

export const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    // Stub implementation for UI development
    return {
      token: 'fake-jwt-token',
      user: {
        id: '1',
        name: data.email.split('@')[0],
        email: data.email,
        preferredLanguage: 'en'
      }
    };
    // const response = await api.post<AuthResponse>('/auth/login', data);
    // return response.data;
  },
  
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    return {
      token: 'fake-jwt-token',
      user: {
        id: '1',
        name: data.name,
        email: data.email,
        preferredLanguage: data.preferredLanguage
      }
    };
    // const response = await api.post<AuthResponse>('/auth/register', data);
    // return response.data;
  }
};
