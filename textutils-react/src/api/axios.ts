import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { getToken, logout } from "../auth/auth";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    Accept: "application/json",
  },
});

/**
 * 🔐 REQUEST INTERCEPTOR
 * Attach Bearer token automatically
 */
api.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = getToken();

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

/**
 * 🚫 RESPONSE INTERCEPTOR
 * Auto logout on 401 (expired / invalid token)
 */
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError<any>) => {
    if (error.response?.status === 401) {
      logout();

      // Hard redirect → guards kick in
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
