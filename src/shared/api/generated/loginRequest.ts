export interface LoginRequest {
  username: string;
  password: string;
  captchaToken?: string;
  deviceInfo?: string;
  countryCode?: string;
}
