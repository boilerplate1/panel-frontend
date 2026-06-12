import { api } from '../base';
import { z } from 'zod';

export const RegisterSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
  confirmPassword: z.string().min(6),
});
export type RegisterDto = z.infer<typeof RegisterSchema>;

export const LoginSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
});
export type LoginDto = z.infer<typeof LoginSchema>;

export const authApi = {
  register: async (data: RegisterDto) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },
  loginWeb: async (data: LoginDto) => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },
  logout: async () => {
    return await api.post('/auth/logout');
  },
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
  initPairing: async () => {
    const response = await api.post('/auth/pair/init');
    return response.data;
  },
  checkPairingStatus: async (sessionId: string) => {
    const response = await api.get(`/auth/pair/status/${sessionId}`);
    return response.data;
  },
};
