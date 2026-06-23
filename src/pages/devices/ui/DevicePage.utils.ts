import { Smartphone, Monitor, Tv, Globe } from 'lucide-react';
import React from 'react';

export const getDeviceIcon = (type: string): React.ReactNode => {
  const t = type.toLowerCase();
  if (t.includes('ios') || t.includes('android') || t.includes('phone')) return React.createElement(Smartphone, { size: 18 });
  if (t.includes('windows') || t.includes('macos') || t.includes('desktop') || t.includes('laptop') || t.includes('computer')) {
    return React.createElement(Monitor, { size: 18 });
  }
  if (t.includes('tv') || t.includes('television') || t.includes('smarttv')) return React.createElement(Tv, { size: 18 });
  return React.createElement(Globe, { size: 18 });
};

export const getDeviceTypeLabel = (type: string): string => {
  const t = type.toLowerCase();
  if (t.includes('ios')) return 'iOS';
  if (t.includes('android')) return 'Android';
  if (t.includes('windows')) return 'Windows';
  if (t.includes('macos')) return 'macOS';
  if (t.includes('linux')) return 'Linux';
  if (t.includes('desktop') || t.includes('computer')) return 'Desktop';
  if (t.includes('laptop')) return 'Laptop';
  if (t.includes('tv')) return 'TV';
  if (t.includes('phone')) return 'Phone';
  if (t.includes('tablet')) return 'Tablet';
  return type;
};