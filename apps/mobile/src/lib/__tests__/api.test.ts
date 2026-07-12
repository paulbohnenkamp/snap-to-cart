import * as SecureStore from 'expo-secure-store';
import { api } from '../api';

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
}));

const response = (status: number, body: unknown) => ({
  status,
  ok: status >= 200 && status < 300,
  text: async () => JSON.stringify(body),
  json: async () => body,
}) as Response;

beforeEach(() => {
  jest.clearAllMocks();
});

test('surfaces the backend error message', async () => {
  (SecureStore.getItemAsync as jest.Mock).mockResolvedValue('access-token');
  global.fetch = jest.fn().mockResolvedValue(response(400, { message: 'Cart integration unavailable' }));

  await expect(api.addToCart('123', 1)).rejects.toThrow('Cart integration unavailable');
});

test('rotates tokens and retries one unauthorized request', async () => {
  let accessToken = 'old-access-token';
  (SecureStore.getItemAsync as jest.Mock).mockImplementation(async (key: string) => key === 'accessToken' ? accessToken : 'refresh-token');
  (SecureStore.setItemAsync as jest.Mock).mockImplementation(async (key: string, value: string) => {
    if (key === 'accessToken') accessToken = value;
  });
  global.fetch = jest.fn()
    .mockResolvedValueOnce(response(401, { message: 'Expired' }))
    .mockResolvedValueOnce(response(200, { accessToken: 'new-access-token', refreshToken: 'new-refresh-token' }))
    .mockResolvedValueOnce(response(200, []));

  await expect(api.history()).resolves.toEqual([]);
  expect(global.fetch).toHaveBeenCalledTimes(3);
  expect(SecureStore.setItemAsync).toHaveBeenCalledWith('accessToken', 'new-access-token');
  expect(SecureStore.setItemAsync).toHaveBeenCalledWith('refreshToken', 'new-refresh-token');
});
