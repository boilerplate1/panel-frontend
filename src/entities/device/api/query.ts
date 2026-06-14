import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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

export function useUpdateDeviceMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => devicesApi.update(id, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: deviceKeys.all });
    },
  });
}

export function useRemoveDeviceMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => devicesApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: deviceKeys.all });
    },
  });
}
