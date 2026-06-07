import { z } from 'zod';
import { DeviceSchema } from '@/entities/device';
import { api, unwrapArray, validateResponse } from '../base';
import type { Device } from '@/entities/device';

export const devicesApi = {
  getAll: async (): Promise<Device[]> => {
    const response = await api.get('/devices');
    const data = unwrapArray<Device>(response.data, ['devices', 'items', 'data']);
    return validateResponse(z.array(DeviceSchema), data);
  },
};
