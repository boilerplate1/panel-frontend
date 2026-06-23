import { create } from 'zustand';

interface UIState {
  toast: { message: string; type: 'success' | 'error' | 'info'; isVisible: boolean } | null;
  isSidebarOpen: boolean;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  hideToast: () => void;
  toggleSidebar: (isOpen?: boolean) => void;
  clearAll: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  toast: null,
  isSidebarOpen: false,
  showToast: (message, type = 'success') => set({ toast: { message, type, isVisible: true } }),
  hideToast: () =>
    set((state) => ({ toast: state.toast ? { ...state.toast, isVisible: false } : null })),
  toggleSidebar: (isOpen) =>
    set((state) => ({
      isSidebarOpen: typeof isOpen === 'boolean' ? isOpen : !state.isSidebarOpen,
    })),
  clearAll: () => set({ toast: null, isSidebarOpen: false }),
}));
