import { useQuery } from '@tanstack/react-query';
import { devicesApi } from '@/shared/api';

export const deviceKeys = {
  all: ['devices'] as const,
};

export function useDevicesQuery(enabled: boolean) {
  return useQuery({
    queryKey: deviceKeys.all,
    queryFn: devicesApi.getAll,
    enabled,
  });
}
