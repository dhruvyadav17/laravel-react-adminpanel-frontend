import axios, { AxiosError } from "axios";
import { getStore } from "../store/storeAccessor";
import { logoutThunk } from "../store/authSlice";
import { refreshTokenService } from "../services/authService";

let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void;
  reject: (err: any) => void;
}[] = [];

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 15000,
  headers: {
    Accept: "application/json",
  },
});

/* ================= REQUEST ================= */
api.interceptors.request.use((config) => {
  const store = getStore();
  const token = store.getState().auth.token;

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/* ================= RESPONSE ================= */
api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError<any>) => {
    const status = error.response?.status;
    const originalRequest: any = error.config;

    /* ================= 401 → TOKEN EXPIRED ================= */
    if (status === 401 && !originalRequest?._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token: string) => {
          originalRequest.headers.Authorization =
            `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken =
        localStorage.getItem("refresh_token");

      if (!refreshToken) {
        forceLogout();
        return Promise.reject(error);
      }

      try {
        const res = await refreshTokenService(
          refreshToken
        );

        const newToken = res.data.data.token;

        localStorage.setItem("token", newToken);

        processQueue(null, newToken);

        originalRequest.headers.Authorization =
          `Bearer ${newToken}`;

        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        forceLogout();
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    /* ================= 403 → UNAUTHORIZED ================= */
    if (status === 403) {
      if (
        !window.location.pathname.includes(
          "/admin/unauthorized"
        )
      ) {
        window.location.replace("/admin/unauthorized");
      }
    }

    return Promise.reject(error);
  }
);

/* ================= HELPERS ================= */

function processQueue(
  error: any,
  token: string | null
) {
  failedQueue.forEach((p) => {
    if (error) {
      p.reject(error);
    } else if (token) {
      p.resolve(token);
    }
  });
  failedQueue = [];
}

function forceLogout() {
  const store = getStore();
  store.dispatch(logoutThunk());

  localStorage.removeItem("token");
  localStorage.removeItem("refresh_token");

  window.location.replace("/login");
}

export default api;
