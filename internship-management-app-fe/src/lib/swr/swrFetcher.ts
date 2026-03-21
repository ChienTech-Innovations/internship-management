/* eslint-disable @typescript-eslint/no-explicit-any */
import { get } from '@/services/api.services';

export const swrFetcher = async <T = any>(url: string): Promise<T | null> => {
  const response = await get<T>(url);
  return response.data ?? null;
};
