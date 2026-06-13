import { api } from '../base';

export const systemApi = {
  checkHealth: async () => {
    const response = await api.get('/health');
    return response.data;
  },
};
