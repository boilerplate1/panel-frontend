export interface PaymentProvidersResponse {
  providers: string[];
  methods?: Record<string, string[]>;
}
