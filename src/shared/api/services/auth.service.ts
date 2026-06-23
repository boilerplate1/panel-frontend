import { apiClient } from '../api-client';
import type { LoginRequest, RegisterRequest, User } from '../generated';
import type { AuthResponse, PairingInitResponse, PairingStatusResponse } from '../generated';

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

  initPairing(): Promise<PairingInitResponse> {
    return apiClient.post('/auth/pair/init').then((r) => r.data);
  }

  checkPairingStatus(sessionId: string): Promise<PairingStatusResponse> {
    return apiClient.get(`/auth/pair/status/${sessionId}`).then((r) => r.data);
  }
}
