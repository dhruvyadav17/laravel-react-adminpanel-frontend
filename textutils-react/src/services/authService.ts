import api from "../api/axios";

/**
 * LOGIN
 * -------------------------------
 * - ONLY authenticate user
 * - returns token
 * - NO role / permission logic here
 */
export const loginService = async (
  email: string,
  password: string
) => {
  return api.post("/login", { email, password });
};

/**
 * PROFILE
 * -------------------------------
 * - single source of truth
 * - user + roles + permissions
 */
export const profileService = () => {
  return api.get("/profile");
};

/**
 * LOGOUT
 * -------------------------------
 * - revoke token (best effort)
 */
export const logoutService = () => {
  return api.post("/logout");
};
