// lib/axios.ts
import Axios, { AxiosInstance, Method } from "axios";
import { getSessionStorageItem } from "utils/localstorage";

/**
 * Helpers
 */
function fixProtocolTypos(url: string): string {
  // If it already has correct protocol, return as-is
  if (/^https?:\/\//i.test(url)) return url;
  // Replace patterns like "http:/localhost" -> "http://localhost"
  return url.replace(/^(https?:)\/+/i, (m, p1) => `${p1}//`);
}

function normalizeBaseUrl(url: string): string {
  const trimmed = url.trim();
  const fixed = fixProtocolTypos(trimmed);
  return fixed.endsWith("/") ? fixed.slice(0, -1) : fixed;
}

function resolveBaseURL(): string {
  const rawEnv = (process.env.NEXT_PUBLIC_API_URL || "").trim();

  if (rawEnv && rawEnv !== "undefined") {
    return normalizeBaseUrl(rawEnv);
  }

  if (typeof window !== "undefined") {
    const origin = window.location.origin || `${window.location.protocol}//${window.location.hostname}`;
    // If dev frontend on :3000, prefer backend on :3001
    return origin.includes(":3000") ? origin.replace(":3000", ":3001") : origin;
  }

  // Server-side fallback
  return "http://localhost:3001";
}

const BASE_URL = resolveBaseURL();

/**
 * Create axios instance
 */
export const axios: AxiosInstance = Axios.create({
  baseURL: BASE_URL,
  timeout: 20000,
});

if (process.env.NODE_ENV !== "production") {
  // eslint-disable-next-line no-console
  console.info("[axios] baseURL =", axios.defaults.baseURL);
}

/**
 * Request interceptor: attach auth token (from session storage helper)
 */
function authRequestInterceptor(config: any) {
  config.headers = config.headers ?? {};
  const adminData: any = getSessionStorageItem("admin");
  if (adminData && adminData.token) {
    config.headers.authorization = `Bearer ${adminData.token}`;
  }

  // Inject x-api-key for routes that require it (e.g., /addBooking)
  const apiKey = process.env.NEXT_PUBLIC_STAYFLEXI_API_KEY;
  if (apiKey) {
    config.headers["x-api-key"] = apiKey;
  }

  config.headers.Accept = "application/json";
  return config;
}

axios.interceptors.request.use(authRequestInterceptor);

/**
 * Response interceptor: return data or result, and normalize errors
 */
axios.interceptors.response.use(
  (response: any) => {
    return response.data?.result ? response.data?.result : response.data;
  },
  (error: any) => {
    let message = error.response?.data?.message || error.message || "Unknown error";
    if (
      error.response &&
      error.response.data &&
      error.response.data.error &&
      (error.response.data.error?.errors || error.response.data.error?.error_params)
    ) {
      message =
        error.response.data.error?.errors?.join(",") ||
        error.response.data.error?.error_params
          ?.map((e: any) => e.message || e.msg)
          ?.join(",") ||
        message;
    }
    return Promise.reject({
      statusCode: error.response?.status,
      message,
      raw: error,
    });
  }
);

/**
 * If caller passes an absolute URL (or slightly malformed absolute URL), use it as-is.
 * Otherwise treat url as relative to axios.baseURL.
 */
function normalizeIfAbsoluteUrl(incoming?: string): string | null {
  if (!incoming) return null;
  const fixed = fixProtocolTypos(incoming.trim());
  if (/^https?:\/\/.+/i.test(fixed)) return fixed;
  return null;
}

/**
 * Main API caller
 * - method: HTTP method
 * - url: relative path (e.g. "/api/superAdmin/login" or "api/superAdmin/login")
 *        OR absolute URL (e.g. "http://example.com/api/...")
 * - data: request body
 */
export async function apiCall<T = any>(method: Method, url: string, data?: any): Promise<T> {
  try {
    // If caller provided an absolute URL, use Axios directly with that URL
    const absolute = normalizeIfAbsoluteUrl(url);
    if (absolute) {
      const resp = await Axios({
        method,
        url: absolute,
        data,
        timeout: 20000,
        headers: { Accept: "application/json" },
      });
      return resp.data?.result ? resp.data?.result : resp.data;
    }

    // Ensure safe relative path (leading slash)
    const safeUrl = url && !url.startsWith("/") ? `/${url}` : url || "/";

    const response: T = await axios({
      method,
      url: safeUrl,
      data,
    });
    return response;
  } catch (err: any) {
    throw err;
  }
}

export default apiCall;
