// src/services/authService.ts

import api from "../api/axios";

/* =====================================================
   AUTH SERVICES
   -----------------------------------------------------
   - ONLY auth-related endpoints
   - No refresh logic here
   - No token mutation here
===================================================== */

/* ================= LOGIN ================= */
/**
 * Returns:
 * {
 *   token: string
 *   refresh_token: string
 * }
 */
export const loginService = (
  email: string,
  password: string
) => {
  return api.post("/login", {
    email,
    password,
  });
};

/* ================= PROFILE ================= */
/**
 * SINGLE SOURCE OF TRUTH
 * {
 *   user: User
 *   permissions: string[]
 * }
 */
export const profileService = () => {
  return api.get("/profile");
};

/* ================= LOGOUT ================= */
/**
 * Best-effort backend logout
 * (frontend state already cleared)
 */
export const logoutService = () => {
  return api.post("/logout");
};

/* ================= REGISTER ================= */
/**
 * USER ONLY
 * Admin creation handled elsewhere
 */
export const registerService = (data: {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}) => {
  return api.post("/register", data);
};
