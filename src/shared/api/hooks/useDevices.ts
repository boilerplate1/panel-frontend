import { useMutation, useQuery, useSuspenseQuery, useQueryClient } from '@tanstack/react-query';
import { devicesService } from '../services';
import type { PaginatedDeviceResponse } from '../generated';

export const deviceKeys = {
  all: ['devices'] as const,
  page: (page: number) => ['devices', 'page', page] as const,
};

export function useDevicesQuery(enabled: boolean, page = 1) {
  return useQuery<PaginatedDeviceResponse>({
    queryKey: deviceKeys.page(page),
    queryFn: () => devicesService.getAll(page),
    enabled,
    staleTime: 30_000,
  });
}

export function useDevicesSuspenseQuery(page = 1) {
  return useSuspenseQuery<PaginatedDeviceResponse>({
    queryKey: deviceKeys.page(page),
    queryFn: () => devicesService.getAll(page),
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
