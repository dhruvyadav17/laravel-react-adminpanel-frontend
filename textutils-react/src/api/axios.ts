import axios, { AxiosError } from "axios";
import { getStore } from "../store/storeAccessor";
import { logoutThunk } from "../store/authSlice";

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
  (error: AxiosError<any>) => {
    const status = error.response?.status;

    if (status === 401) {
      const store = getStore();
      store.dispatch(logoutThunk());

      if (!window.location.pathname.includes("/login")) {
        window.location.replace("/login");
      }
    }

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

export default api;
