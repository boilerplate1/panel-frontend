export interface RegisterRequest {
  username: string;
  password: string;
  confirmPassword: string;
  email?: string;
  captchaToken?: string;
  deviceInfo?: string;
  countryCode?: string;
}
