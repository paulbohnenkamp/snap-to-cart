import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { api } from '@/lib/api';

type State = {
  ready: boolean;
  authenticated: boolean;
  hydrate: () => Promise<void>;
  save: (accessToken: string, refreshToken: string) => Promise<void>;
  logout: () => Promise<void>;
};

export const useSession = create<State>((set) => ({
  ready: false,
  authenticated: false,
  hydrate: async () => set({ ready: true, authenticated: Boolean(await SecureStore.getItemAsync('accessToken')) }),
  save: async (accessToken, refreshToken) => {
    await SecureStore.setItemAsync('accessToken', accessToken);
    await SecureStore.setItemAsync('refreshToken', refreshToken);
    set({ authenticated: true });
  },
  logout: async () => {
    const refreshToken = await SecureStore.getItemAsync('refreshToken');
    if (refreshToken) {
      try { await api.logout(refreshToken); } catch { /* Local sign-out must still succeed offline. */ }
    }
    await SecureStore.deleteItemAsync('accessToken');
    await SecureStore.deleteItemAsync('refreshToken');
    set({ authenticated: false });
  },
}));
