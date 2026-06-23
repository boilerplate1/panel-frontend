import { apiClient } from '../api-client';

export class SystemService {
  checkHealth(): Promise<unknown> {
    return apiClient.get('/health').then((r) => r.data);
  }
}
