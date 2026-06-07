import { useQuery } from '@tanstack/react-query';
import { devicesApi } from '@/shared/api';
import type { Device } from '../model/types';

export const deviceKeys = {
  all: ['devices'] as const,
};

export function useDevicesQuery(enabled: boolean) {
  return useQuery<Device[]>({
    queryKey: deviceKeys.all,
    queryFn: devicesApi.getAll,
    enabled,
    staleTime: 30_000,
  });
}
