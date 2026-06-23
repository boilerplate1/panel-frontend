import { apiClient } from '../api-client';
import type { DeviceUpdateRequest, PaginatedDeviceResponse } from '../generated';

export class DevicesService {
  getAll(page = 1, limit = 20): Promise<PaginatedDeviceResponse> {
    return apiClient.get('/devices', { params: { page, limit } }).then((r) => r.data);
  }

  update(id: string, data: DeviceUpdateRequest): Promise<{ success: boolean }> {
    return apiClient.patch(`/devices/${id}`, data).then((r) => r.data);
  }

  remove(id: string): Promise<{ success: boolean }> {
    return apiClient.delete(`/devices/${id}`).then((r) => r.data);
  }
}
