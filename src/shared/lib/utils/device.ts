import { Globe, Monitor, Smartphone, Tv } from 'lucide-react';
import { createElement, type ReactNode } from 'react';

export const getDeviceIcon = (type: string): ReactNode => {
  const normalizedType = type.toLowerCase();

  if (
    normalizedType.includes('ios') ||
    normalizedType.includes('android') ||
    normalizedType.includes('phone')
  ) {
    return createElement(Smartphone, { size: 18 });
  }

  if (
    normalizedType.includes('windows') ||
    normalizedType.includes('macos') ||
    normalizedType.includes('desktop') ||
    normalizedType.includes('laptop') ||
    normalizedType.includes('computer')
  ) {
    return createElement(Monitor, { size: 18 });
  }

  if (
    normalizedType.includes('tv') ||
    normalizedType.includes('television') ||
    normalizedType.includes('smarttv')
  ) {
    return createElement(Tv, { size: 18 });
  }

  return createElement(Globe, { size: 18 });
};

export const getDeviceTypeLabel = (type: string): string => {
  const normalizedType = type.toLowerCase();

  if (normalizedType.includes('ios')) return 'iOS';
  if (normalizedType.includes('android')) return 'Android';
  if (normalizedType.includes('windows')) return 'Windows';
  if (normalizedType.includes('macos')) return 'macOS';
  if (normalizedType.includes('linux')) return 'Linux';
  if (normalizedType.includes('desktop') || normalizedType.includes('computer')) {
    return 'Desktop';
  }
  if (normalizedType.includes('laptop')) return 'Laptop';
  if (normalizedType.includes('tv')) return 'TV';
  if (normalizedType.includes('phone')) return 'Phone';
  if (normalizedType.includes('tablet')) return 'Tablet';

  return type;
};
