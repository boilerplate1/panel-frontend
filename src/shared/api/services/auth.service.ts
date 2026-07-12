import { apiClient } from '../api-client';
import type { LoginRequest, RegisterRequest, User } from '../generated';
import type { AuthResponse } from '../generated';

export class AuthService {
  register(data: RegisterRequest): Promise<AuthResponse> {
    return apiClient.post('/auth/register', data).then((r) => r.data);
  }

  loginWeb(data: LoginRequest): Promise<AuthResponse> {
    return apiClient.post('/auth/login', data).then((r) => r.data);
  }

  logout(): Promise<void> {
    return apiClient.post('/auth/logout').then((r) => r.data);
  }

  getMe(): Promise<User> {
    return apiClient.get('/auth/me').then((r) => r.data);
  }

  getCaptchaStatus(): Promise<{ loginRequired: boolean; registerRequired: boolean }> {
    return apiClient.get('/auth/captcha-status').then((r) => r.data);
  }
}
