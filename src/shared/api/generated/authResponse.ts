export interface User {
  id: number;
  username: string;
  email: string | null;
  account_key?: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}
