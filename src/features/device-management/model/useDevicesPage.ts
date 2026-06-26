import { useState } from 'react';
import { useDevicesQuery, useRemoveDeviceMutation, useUpdateDeviceMutation } from '@/shared/api';
import { useAuth } from '@/features/auth';

export function useDevicesPage() {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [editingDevice, setEditingDevice] = useState<{ id: string; name: string } | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const {
    data: paginated,
    isLoading,
    isError,
    refetch,
    dataUpdatedAt,
  } = useDevicesQuery(!!user, page);
  const updateDeviceMutation = useUpdateDeviceMutation();
  const removeDeviceMutation = useRemoveDeviceMutation();

  const saveDeviceName = async (newName: string) => {
    if (!editingDevice) return;

    try {
      await updateDeviceMutation.mutateAsync({ id: editingDevice.id, name: newName });
      setEditingDevice(null);
    } catch (error) {
      console.error(error);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;

    try {
      await removeDeviceMutation.mutateAsync(deleteTargetId);
      setDeleteTargetId(null);
    } catch (error) {
      console.error(error);
    }
  };

  return {
    user,
    page,
    setPage,
    isLoading,
    isError,
    refetch,
    dataUpdatedAt,
    devices: paginated?.items ?? [],
    totalPages: paginated?.totalPages ?? 0,
    editingDevice,
    deleteTargetId,
    editDevice: (id: string, name: string) => setEditingDevice({ id, name }),
    closeEditModal: () => setEditingDevice(null),
    requestDelete: setDeleteTargetId,
    closeDeleteModal: () => setDeleteTargetId(null),
    saveDeviceName,
    confirmDelete,
    isUpdatingDevice: updateDeviceMutation.isPending,
    isRemovingDevice: removeDeviceMutation.isPending,
  };
}
