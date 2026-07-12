import * as SecureStore from 'expo-secure-store';
import { ScanResult } from '@/types';

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8080';

async function errorMessage(response: Response) {
  const text = await response.text();
  try {
    return JSON.parse(text).message ?? text;
  } catch {
    return text || `Request failed: ${response.status}`;
  }
}

async function refreshAccessToken() {
  const refreshToken = await SecureStore.getItemAsync('refreshToken');
  if (!refreshToken) return null;
  const response = await fetch(`${API_URL}/api/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });
  if (!response.ok) return null;
  const tokens = await response.json() as { accessToken: string; refreshToken: string };
  await SecureStore.setItemAsync('accessToken', tokens.accessToken);
  await SecureStore.setItemAsync('refreshToken', tokens.refreshToken);
  return tokens.accessToken;
}

async function request<T>(path: string, init: RequestInit = {}, canRetry = true): Promise<T> {
  const token = await SecureStore.getItemAsync('accessToken');
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { ...(init.headers ?? {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) },
  });
  if (response.status === 401 && canRetry && !path.startsWith('/api/auth/')) {
    const refreshedToken = await refreshAccessToken();
    if (refreshedToken) return request<T>(path, init, false);
  }
  if (!response.ok) throw new Error(await errorMessage(response));
  return response.json();
}

export type CartActionResponse = { status: 'demo-added' | 'added'; upc: string; quantity: number };

export const api = {
  login: (email: string, password: string) => request<{ accessToken: string; refreshToken: string }>('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) }),
  register: (name: string, email: string, password: string) => request<{ accessToken: string; refreshToken: string }>('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, email, password }) }),
  logout: (refreshToken: string) => request<void>('/api/auth/logout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ refreshToken }) }),
  scan: async (uri: string): Promise<ScanResult> => {
    const body = new FormData();
    body.append('image', { uri, name: 'package.jpg', type: 'image/jpeg' } as any);
    return request('/api/scans', { method: 'POST', body });
  },
  history: () => request<any[]>('/api/scans'),
  addToCart: (upc: string, quantity: number) => request<CartActionResponse>('/api/kroger/cart/items', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ upc, quantity }) }),
  krogerConnectUrl: () => request<{ url: string }>('/api/kroger/connect'),
};
