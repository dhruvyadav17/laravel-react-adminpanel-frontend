import { toast } from "react-toastify";

function extractMessage(input: any, fallback: string): string {
  if (!input) return fallback;

  // axios / rtk response
  const data = input?.data ?? input?.response?.data;

  if (data?.message) return data.message;

  // validation
  if (data?.errors) {
    const firstKey = Object.keys(data.errors)[0];
    if (firstKey && data.errors[firstKey]?.length) {
      return data.errors[firstKey][0];
    }
  }

  return fallback;
}

/* ================= SUCCESS ================= */
export const handleApiSuccess = (
  res?: any,
  fallback = "Action completed successfully"
) => {
  const message = extractMessage(res, fallback);
  toast.success(message);
};

/* ================= ERROR ================= */
export const handleApiError = (
  error: any,
  fallback = "Something went wrong"
) => {
  const status =
    error?.status ?? error?.response?.status;

  let defaultMessage = fallback;

  if (status === 401) {
    defaultMessage = "Please login to continue";
  }

  if (status === 403) {
    defaultMessage = "You are not authorized";
  }

  const message = extractMessage(error, defaultMessage);
  toast.error(message);
};
