import { api } from '../base';
import type { ClientSettings } from '../types';

export const systemApi = {
  checkHealth: async () => {
    const response = await api.get('/health');
    return response.data;
  },
  getClientSettings: async (): Promise<ClientSettings> => {
    const response = await api.get('/client/settings');
    const payload = response.data;
    const data =
      payload && typeof payload === 'object' && 'data' in payload
        ? (payload as Record<string, unknown>).data
        : payload;
    const flags =
      data && typeof data === 'object' && 'flags' in data
        ? (data as Record<string, unknown>).flags
        : null;
    const allowRegistration =
      flags && typeof flags === 'object' && 'allowRegistration' in flags
        ? Boolean((flags as Record<string, unknown>).allowRegistration)
        : true;

    return { flags: { allowRegistration } };
  },
};
