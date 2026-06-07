import { create } from 'zustand';

interface UIState {
  toast: { message: string; type: 'success' | 'error' | 'info'; isVisible: boolean } | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  hideToast: () => void;
  clearAll: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  toast: null,
  showToast: (message, type = 'success') => set({ toast: { message, type, isVisible: true } }),
  hideToast: () =>
    set((state) => ({ toast: state.toast ? { ...state.toast, isVisible: false } : null })),
  clearAll: () => set({ toast: null }),
}));
