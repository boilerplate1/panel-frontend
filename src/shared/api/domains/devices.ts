import { api, unwrapArray } from '../base';
import type { Device } from '@/entities/device';

export const devicesApi = {
  getAll: async (): Promise<Device[]> => {
    const response = await api.get('/devices');
    return unwrapArray<Device>(response.data, ['devices', 'items', 'data']);
  },
};
