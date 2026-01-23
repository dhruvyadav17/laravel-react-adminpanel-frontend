import api from "../api/axios";

/* LOGIN */
export const loginService = (email: string, password: string) =>
  api.post("/login", { email, password });

/* PROFILE */
export const profileService = () =>
  api.get("/profile");

/* LOGOUT */
export const logoutService = () =>
  api.post("/logout");

/* 🆕 REGISTER (USER ONLY) */
export const registerService = (data: {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}) => {
  return api.post("/register", data);
};

export const refreshTokenService = (refreshToken: string) => {
  return api.post("/refresh-token", {
    refresh_token: refreshToken,
  });
};
