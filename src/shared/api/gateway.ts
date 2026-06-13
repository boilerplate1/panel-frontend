import axios from 'axios';
import { APP_CONFIG } from '../config';

const STORAGE_KEY = 'hypex_gateway_url';
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

interface GatewayState {
  url: string;
  timestamp: number;
}

/**
 * Resolves the actual API Gateway URL using the resilient discovery path:
 * 1. Read Yandex Disk (Ultimate Root) -> get Config Service URL.
 * 2. Read Config Service -> get current API Gateway URL.
 */
export async function resolveGateway(): Promise<string> {
  // 1. Check LocalStorage for cached ACTUAL API URL
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

  // 2. Discovery Flow
  try {
    if (APP_CONFIG.GATEWAY_CONFIG_URL.includes('ВАШ_КОД_ЗДЕСЬ')) {
      return APP_CONFIG.API_BASE_URL;
    }

    // Step A: Fetch Config Service URL from Yandex Disk
    const yandexResponse = await axios.get(APP_CONFIG.GATEWAY_CONFIG_URL, { timeout: 3000 });
    const configServiceUrl = yandexResponse.data?.trim();

    if (!configServiceUrl || !configServiceUrl.startsWith('http')) {
      throw new Error('Invalid Config Service URL from Yandex Disk');
    }

    // Step B: Fetch Actual API URL from Config Service
    const configResponse = await axios.get(configServiceUrl, { timeout: 3000 });
    const actualApiUrl = configResponse.data?.trim();

    if (actualApiUrl && actualApiUrl.startsWith('http')) {
      const state: GatewayState = { url: actualApiUrl, timestamp: Date.now() };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      return actualApiUrl;
    }
  } catch (error) {
    console.warn('[Gateway] Discovery flow failed, using fallback:', error);
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
