import { toast } from "react-toastify";

/**
 * 🔍 Extract message safely from ANY response/error
 */
function extractMessage(
  input: any,
  fallback: string
): string {
  if (!input) return fallback;

  // ✅ Direct string
  if (typeof input === "string") {
    return input;
  }

  // ✅ Axios / RTK response
  const data = input?.data ?? input?.response?.data;

  if (data?.message && typeof data.message === "string") {
    return data.message;
  }

  // ✅ Laravel validation (422)
  if (data?.errors && typeof data.errors === "object") {
    const firstKey = Object.keys(data.errors)[0];
    if (firstKey && data.errors[firstKey]?.length) {
      return data.errors[firstKey][0];
    }
  }

  // ✅ RTK rejectWithValue
  if (input?.error && typeof input.error === "string") {
    return input.error;
  }

  return fallback;
}

/* ================= SUCCESS ================= */

export const handleApiSuccess = (
  res?: any,
  fallbackMessage = "Action completed successfully"
) => {
  const message = extractMessage(res, fallbackMessage);
  toast.success(message);
};

/* ================= ERROR ================= */

export const handleApiError = (
  error: any,
  fallbackMessage = "Something went wrong"
) => {
  const status =
    error?.status ??
    error?.response?.status;

  let defaultMessage = fallbackMessage;

  // 🔐 Auth / Spatie errors
  if (status === 401 || status === 403) {
    defaultMessage =
      "You are not authorized to perform this action";
  }

  const message = extractMessage(
    error,
    defaultMessage
  );

  toast.error(message);
};

/* 🔄 Backward compatibility */
export const toastSuccess = handleApiSuccess;
export const toastError = handleApiError;
