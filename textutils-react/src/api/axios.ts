import axios, { AxiosError } from "axios";
import { getStore } from "../store/storeAccessor";
import { logoutThunk } from "../store/authSlice";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: { Accept: "application/json" },
});

/* REQUEST */
api.interceptors.request.use((config) => {
  const store = getStore();
  const token = store.getState().auth.token;

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/* RESPONSE */
api.interceptors.response.use(
  (res) => res,
  (error: AxiosError<any>) => {
    const status = error.response?.status;

    if (status === 401) {
      const store = getStore();
      store.dispatch(logoutThunk());

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    if (status === 403) {
      if (
        window.location.pathname !==
        "/admin/unauthorized"
      ) {
        window.location.href = "/admin/unauthorized";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
