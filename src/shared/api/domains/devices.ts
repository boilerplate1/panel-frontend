import { api, unwrapArray } from '../base';
import type { Device } from '@/entities/device';

export const devicesApi = {
  getAll: async (): Promise<Device[]> => {
    const response = await api.get('/devices');
    return unwrapArray<Device>(response.data, ['devices', 'items', 'data']);
  },

  update: async (id: string, name: string): Promise<{ success: boolean }> => {
    const response = await api.patch(`/devices/${id}`, { name });
    return response.data;
  },

  remove: async (id: string): Promise<{ success: boolean }> => {
    const response = await api.delete(`/devices/${id}`);
    return response.data;
  },
};
