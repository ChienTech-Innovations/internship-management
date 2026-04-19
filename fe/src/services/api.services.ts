/* eslint-disable @typescript-eslint/no-explicit-any */
import { API_URL } from "@/constants";
import { appLogger } from "@/lib/observability/logger";
import { useAuthStore } from "@/store/useAuthStore";
import { Config, ResponseBase } from "@/types/basic.type";

const getCommonHeaders = (token?: string): HeadersInit => {
  const headers: HeadersInit = {
    Accept: "application/json",
    "Content-type": "application/json"
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

const makeRequest = async <TData = any>(
  url: string,
  options: RequestInit = {},
  config?: Config
): Promise<ResponseBase<TData>> => {
  const now = () =>
    typeof performance !== "undefined" ? performance.now() : Date.now();
  const { baseUrl = API_URL } = config ?? {};

  const { accessToken } = useAuthStore.getState();

  const headers: HeadersInit = {
    ...getCommonHeaders(accessToken || undefined),
    ...options.headers
  };

  const finalUrl = `${baseUrl}${url}`;
  const startTime = now();

  try {
    const response = await fetch(finalUrl, {
      ...options,
      headers,
      credentials: "include" // Always send cookies (JWT)
    });

    let resData: any = null;
    let responseText = "";
    try {
      responseText = await response.text();
      resData = responseText ? JSON.parse(responseText) : null;
    } catch (parseError) {
      // If JSON parse fails, try to extract message from text
      console.warn("Failed to parse JSON response:", parseError);
      // If it's not JSON, maybe it's plain text error message
      if (responseText) {
        resData = { message: responseText };
      }
    }

    if (!response.ok) {
      // NestJS returns errors in format: { statusCode, message, error }
      // Try multiple ways to extract error message
      const errorMessage =
        resData?.message ||
        resData?.error ||
        (typeof resData === "string" ? resData : null) ||
        responseText ||
        `HTTP Error ${response.status}`;
      appLogger.error("api_request_failed", {
        url: finalUrl,
        method: options.method ?? "GET",
        status: response.status,
        durationMs: Number((now() - startTime).toFixed(2))
      });
      throw new Error(errorMessage);
    }

    appLogger.metric(
      "api.request.duration",
      Number((now() - startTime).toFixed(2)),
      "ms",
      {
        url: finalUrl,
        method: options.method ?? "GET",
        status: response.status
      }
    );

    return resData as ResponseBase<TData>;
  } catch (error) {
    appLogger.error("api_request_exception", {
      url: finalUrl,
      method: options.method ?? "GET",
      durationMs: Number((now() - startTime).toFixed(2)),
      message: error instanceof Error ? error.message : "Unknown error"
    });
    // If it's already an Error with message, re-throw it
    if (error instanceof Error) {
      throw error;
    }
    throw new Error((error as Error).message || "Something happen!");
  }
};

export const get = <T = any>(
  url: string,
  option?: RequestInit,
  config?: Config
): Promise<ResponseBase<T>> => {
  return makeRequest<T>(url, { method: "GET", ...option }, config);
};

export const post = <T = any, B = unknown>(
  url: string,
  body?: B,
  options?: RequestInit,
  config?: Config
): Promise<ResponseBase<T>> => {
  return makeRequest<T>(
    url,
    {
      method: "POST",
      body: JSON.stringify(body),
      ...options
    },
    config
  );
};

export const put = <T = any, B = unknown>(
  url: string,
  body?: B,
  options?: RequestInit,
  config?: Config
): Promise<ResponseBase<T>> => {
  return makeRequest<T>(
    url,
    { method: "PUT", body: JSON.stringify(body), ...options },
    config
  );
};

export const patch = <T = any, B = unknown>(
  url: string,
  body?: B,
  options?: RequestInit,
  config?: Config
): Promise<ResponseBase<T>> => {
  return makeRequest<T>(
    url,
    {
      method: "PATCH",
      body: JSON.stringify(body),
      ...options
    },
    config
  );
};

export const del = <T>(
  url: string,
  options?: RequestInit,
  config?: Config
): Promise<ResponseBase<T>> => {
  return makeRequest<T>(url, { method: "DELETE", ...options }, config);
};

export const requestData = async <T>(
  promise: Promise<ResponseBase<T>>
): Promise<T> => {
  const response = await promise;

  if (!response.data) {
    throw new Error("No data returned from API");
  }

  return response.data;
};

// ADD: Blob getter for file downloads
export const getBlob = async (
  url: string,
  option?: RequestInit,
  config?: Config
): Promise<Blob> => {
  const { baseUrl = API_URL } = config ?? {};
  const { accessToken } = useAuthStore.getState();

  const headers: HeadersInit = {
    ...getCommonHeaders(accessToken || undefined),
    Accept: "application/pdf",
    ...(option?.headers || {})
  };

  const finalUrl = `${baseUrl}${url}`;
  const response = await fetch(finalUrl, {
    method: "GET",
    ...option,
    headers,
    credentials: "include"
  });

  if (!response.ok) {
    const message = `HTTP Error ${response.status}`;
    throw new Error(message);
  }

  return await response.blob();
};
