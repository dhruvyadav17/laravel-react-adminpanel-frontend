// src/utils/toastHelper.ts

import { toast } from "react-toastify";

/* =====================================================
   MESSAGE EXTRACTION
   -----------------------------------------------------
   Priority:
   1. Backend message
   2. First validation error
   3. Fallback
===================================================== */

function extractMessage(
  input: any,
  fallback: string
): string {
  if (!input) return fallback;

  const data =
    input?.data ??
    input?.response?.data ??
    input;

  /* ===== backend message ===== */
  if (typeof data?.message === "string") {
    return data.message;
  }

  /* ===== validation errors ===== */
  if (
    data?.errors &&
    typeof data.errors === "object"
  ) {
    const firstKey = Object.keys(data.errors)[0];
    const firstError =
      firstKey && data.errors[firstKey]?.[0];

    if (firstError) {
      return firstError;
    }
  }

  return fallback;
}

/* =====================================================
   SUCCESS TOAST
===================================================== */

export const handleApiSuccess = (
  res?: any,
  fallback = "Action completed successfully"
) => {
  const message = extractMessage(res, fallback);

  if (!message) return; // silent success allowed

  toast.success(message);
};

/* =====================================================
   ERROR TOAST
===================================================== */

export const handleApiError = (
  error: any,
  fallback = "Something went wrong"
) => {
  const status =
    error?.status ??
    error?.response?.status;

  let defaultMessage = fallback;

  /* ===== auth related ===== */
  if (status === 401) {
    defaultMessage = "Please login to continue";
  } else if (status === 403) {
    defaultMessage = "You are not authorized";
  }

  const message = extractMessage(
    error,
    defaultMessage
  );

  toast.error(message);
};
