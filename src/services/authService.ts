import axios, { AxiosInstance } from 'axios';
import { User } from '../types';

const API_URL = 'https://blogosaurus-revamp.onrender.com';

// Create an axios instance with default config
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
});

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

interface AuthResponse {
  user: User;
  access_token: string;
}

export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await api.post('/auth/login', { email, password });
    return {
      user: response.data.user,
      access_token: response.data.access_token
    };
  } catch (error) {
    throw new Error('Login failed');
  }
};

export const registerUser = async (
  name: string,
  email: string, 
  password: string
): Promise<AuthResponse> => {
  try {
    const response = await api.post('/auth/signup', {
      name,
      email,
      password,
    });
    return {
      user: response.data.user,
      access_token: response.data.access_token
    };
  } catch (error) {
    throw new Error('Registration failed');
  }
};

export const getCurrentUser = async (): Promise<User> => {
  try {
    const response = await api.get('/auth/me');
    return response.data.user;
  } catch (error) {
    throw new Error('Failed to get current user');
  }
};