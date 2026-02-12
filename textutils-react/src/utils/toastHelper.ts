import { toast } from "react-toastify";

type ToastVariant = "success" | "danger";

/* ================= MESSAGE EXTRACT ================= */

function extractMessage(input: any, fallback: string): string {
  if (!input) return fallback;

  const data =
    input?.data ??
    input?.response?.data ??
    input;

  if (
    typeof data?.message === "string" &&
    data.message.trim().length > 0
  ) {
    return data.message;
  }

  if (data?.errors && typeof data.errors === "object") {
    const firstKey = Object.keys(data.errors)[0];
    const firstError = firstKey && data.errors[firstKey]?.[0];

    if (typeof firstError === "string" && firstError.trim()) {
      return firstError;
    }
  }

  return fallback;
}

/* ================= SUCCESS / DANGER ================= */

export const handleApiSuccess = (
  res?: any,
  fallback = "Action completed successfully",
  variant: ToastVariant = "success"
) => {
  const message = extractMessage(res, fallback);
  if (!message) return;

  if (variant === "danger") {
    toast.error(message); // 🔴 RED
  } else {
    toast.success(message); // 🟢 GREEN
  }
};

/* ================= ERROR ================= */

export const handleApiError = (
  error: any,
  fallback = "Something went wrong"
) => {
  const status =
    error?.status ??
    error?.response?.status;

  let defaultMessage = fallback;

  if (status === 401) defaultMessage = "Please login to continue";
  else if (status === 403) defaultMessage = "You are not authorized";

  const message = extractMessage(error, defaultMessage);
  toast.error(message);
};
