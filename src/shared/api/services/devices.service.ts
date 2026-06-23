import { apiClient } from '../api-client';
import type { DeviceResponse, DeviceUpdateRequest } from '../generated';

export class DevicesService {
  getAll(): Promise<DeviceResponse[]> {
    return apiClient.get('/devices').then((r) => r.data);
  }

  update(id: string, data: DeviceUpdateRequest): Promise<{ success: boolean }> {
    return apiClient.patch(`/devices/${id}`, data).then((r) => r.data);
  }

  remove(id: string): Promise<{ success: boolean }> {
    return apiClient.delete(`/devices/${id}`).then((r) => r.data);
  }
}
