/* eslint-disable @typescript-eslint/no-explicit-any */
import useSWR, { SWRConfiguration, Key } from "swr";
import { swrFetcher } from "./swrFetcher";
import { useToastStore } from "@/store/useToastStore";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface CustomSWRConfig<Data = any, Error = any> extends SWRConfiguration {
  showError?: boolean;
}

/**
 * Custom hooks used with default or custom fetchers
 */
export function useCustomSWR<Data = any, Error = any>(
  key: Key,
  fetcher?: () => Promise<Data | null>,
  options?: CustomSWRConfig<Data, Error>
) {
  const { showToastError } = useToastStore();
  const { showError = false, ...swrOptions } = options || {};

  const { data, error, isLoading, mutate, isValidating } = useSWR<
    Data | null,
    Error
  >(key, fetcher ?? (() => swrFetcher<Data>(key as string)), {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    shouldRetryOnError: false,
    ...swrOptions
  });

  if (showError && error) {
    showToastError(`Error fetching ${String(key)}`);
  }

  return {
    data,
    error,
    isLoading,
    mutate,
    isValidating
  };
}
