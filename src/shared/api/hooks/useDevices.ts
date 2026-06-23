import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { devicesService } from '../services';
import type { DeviceResponse } from '../generated';

export const deviceKeys = {
  all: ['devices'] as const,
};

export function useDevicesQuery(enabled: boolean) {
  return useQuery<DeviceResponse[]>({
    queryKey: deviceKeys.all,
    queryFn: devicesService.getAll,
    enabled,
    staleTime: 30_000,
  });
}

export function useUpdateDeviceMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => devicesService.update(id, { name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: deviceKeys.all });
    },
  });
}

export function useRemoveDeviceMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => devicesService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: deviceKeys.all });
    },
  });
}
