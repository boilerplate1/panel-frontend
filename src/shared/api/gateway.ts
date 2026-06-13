import axios from 'axios';
import { APP_CONFIG } from '../config';

const STORAGE_KEY = 'hypex_gateway_url';
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

interface GatewayState {
  url: string;
  timestamp: number;
}

/**
 * Resolves the actual API Gateway URL from Yandex Disk or LocalStorage.
 */
export async function resolveGateway(): Promise<string> {
  // 1. Check LocalStorage first
  const cached = localStorage.getItem(STORAGE_KEY);
  if (cached) {
    try {
      const state: GatewayState = JSON.parse(cached);
      if (Date.now() - state.timestamp < CACHE_TTL) {
        return state.url;
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  // 2. Fetch from Yandex Disk if no cache or expired
  try {
    // If it's a direct link, use it. If it's a public disk link, we'd normally need 
    // to use Yandex Disk API to get the download URL. 
    // For now, we assume GATEWAY_CONFIG_URL points to a raw text file or we use the fallback.
    
    if (APP_CONFIG.GATEWAY_CONFIG_URL.includes('ВАШ_КОД_ЗДЕСЬ')) {
      return APP_CONFIG.API_BASE_URL;
    }

    const response = await axios.get(APP_CONFIG.GATEWAY_CONFIG_URL, { timeout: 3000 });
    const newUrl = response.data?.trim();

    if (newUrl && newUrl.startsWith('http')) {
      const state: GatewayState = { url: newUrl, timestamp: Date.now() };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      return newUrl;
    }
  } catch (error) {
    console.warn('[Gateway] Failed to resolve gateway, using fallback:', error);
  }

  return APP_CONFIG.API_BASE_URL;
}

/**
 * Force refresh the gateway URL from the source.
 */
export async function refreshGateway(): Promise<string> {
  localStorage.removeItem(STORAGE_KEY);
  return resolveGateway();
}
