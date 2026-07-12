import { useState, useCallback } from 'react';
import { useDevicesSuspenseQuery, useRemoveDeviceMutation, useUpdateDeviceMutation } from '@/shared/api';
import { useAuth } from '@/features/auth';

export function useDevicesPage() {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [editingDevice, setEditingDevice] = useState<{ id: string; name: string } | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const {
    data: paginated,
    refetch,
    dataUpdatedAt,
  } = useDevicesSuspenseQuery(page);
  const updateDeviceMutation = useUpdateDeviceMutation();
  const removeDeviceMutation = useRemoveDeviceMutation();

  const saveDeviceName = useCallback(async (newName: string) => {
    if (!editingDevice) return;

    try {
      await updateDeviceMutation.mutateAsync({ id: editingDevice.id, name: newName });
      setEditingDevice(null);
    } catch (error) {
      console.error(error);
    }
  }, [editingDevice, updateDeviceMutation]);

  const confirmDelete = useCallback(async () => {
    if (!deleteTargetId) return;

    try {
      await removeDeviceMutation.mutateAsync(deleteTargetId);
      setDeleteTargetId(null);
    } catch (error) {
      console.error(error);
    }
  }, [deleteTargetId, removeDeviceMutation]);

  const editDevice = useCallback((id: string, name: string) => setEditingDevice({ id, name }), []);
  const closeEditModal = useCallback(() => setEditingDevice(null), []);
  const requestDelete = useCallback((id: string | null) => setDeleteTargetId(id), []);
  const closeDeleteModal = useCallback(() => setDeleteTargetId(null), []);

  return {
    user,
    page,
    setPage,
    refetch,
    dataUpdatedAt,
    devices: paginated?.items ?? [],
    totalPages: paginated?.totalPages ?? 0,
    editingDevice,
    deleteTargetId,
    editDevice,
    closeEditModal,
    requestDelete,
    closeDeleteModal,
    saveDeviceName,
    confirmDelete,
    isUpdatingDevice: updateDeviceMutation.isPending,
    isRemovingDevice: removeDeviceMutation.isPending,
  };
}
