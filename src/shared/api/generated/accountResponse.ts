export interface AccountResponse {
  id: number;
  username: string;
  displayName: string;
  email: string | null;
  account_key: string;
  isAdmin: boolean;
}
