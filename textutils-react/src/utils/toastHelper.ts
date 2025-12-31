import { toast } from "react-toastify";

/* ================= SUCCESS ================= */

/**
 * Show success toast
 * - backend response supported
 * - fallback message optional
 */
export const toastSuccess = (
  resOrMessage?: any,
  fallbackMessage = "Action completed successfully"
) => {
  const message =
    typeof resOrMessage === "string"
      ? resOrMessage
      : resOrMessage?.data?.message ?? fallbackMessage;

  toast.success(message);
};

/* ================= ERROR ================= */

/**
 * Show error toast
 * - Laravel / Axios / RTK compatible
 */
export const toastError = (
  error: any,
  fallbackMessage = "Something went wrong"
) => {
  const message =
    error?.response?.data?.message ??
    error?.error ??
    fallbackMessage;

  toast.error(message);
};

/* ================= ALIASES (BACKWARD COMPAT) ================= */

/**
 * For old code compatibility
 */
export const handleApiSuccess = toastSuccess;
export const handleApiError = toastError;
