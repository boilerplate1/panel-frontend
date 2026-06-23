import type { AccountResponse } from './accountResponse';

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: AccountResponse;
}
