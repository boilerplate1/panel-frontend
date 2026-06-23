import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface DeviceEmojiStore {
  emojiMap: Record<string, string>;
  setEmoji: (deviceId: string, emoji: string) => void;
  getEmoji: (deviceId: string, fallback?: string) => string;
}

export const useDeviceEmojiStore = create<DeviceEmojiStore>()(
  persist(
    (set, get) => ({
      emojiMap: {},
      setEmoji: (deviceId, emoji) =>
        set((state) => ({ emojiMap: { ...state.emojiMap, [deviceId]: emoji } })),
      getEmoji: (deviceId, fallback) => get().emojiMap[deviceId] ?? fallback ?? '',
    }),
    { name: 'device-emoji' },
  ),
);
