import api from "../api/axios";
import { getStore } from "../store/storeAccessor";
import { fetchProfileThunk } from "../store/authSlice";

/**
 * START IMPERSONATION
 * -----------------------------------
 * Admin → Login as another user
 */
export async function startImpersonation(
  userId: number
) {
  const res = await api.post(
    `/admin/impersonate/${userId}`
  );

  const token = res.data.data.token;

  /* ================= STORAGE ================= */

  localStorage.setItem("token", token);
  localStorage.setItem("impersonating", "1");

  /* ================= STATE SYNC ================= */

  const store = getStore();
  await store.dispatch(fetchProfileThunk());

  /* ================= REDIRECT ================= */

  window.location.replace("/profile");
}

/**
 * STOP IMPERSONATION
 * -----------------------------------
 * Return back to original admin
 */
export async function stopImpersonation() {
  const res = await api.post(
    "/admin/impersonate-exit"
  );

  const token = res.data.data.token;

  /* ================= STORAGE ================= */

  localStorage.setItem("token", token);
  localStorage.removeItem("impersonating");

  /* ================= STATE SYNC ================= */

  const store = getStore();
  await store.dispatch(fetchProfileThunk());

  /* ================= REDIRECT ================= */

  window.location.replace("/admin/dashboard");
}
