import { toast } from "react-toastify";

/**
 * SUCCESS handler (Laravel ApiResponse compatible)
 */
export const handleApiSuccess = (
  res: any,
  fallbackMessage = "Action completed successfully"
) => {
  const message =
    res?.data?.message ??
    fallbackMessage;

  toast.success(message);
};

/**
 * ERROR handler (Laravel ApiResponse compatible)
 */
export const handleApiError = (
  error: any,
  fallbackMessage = "Something went wrong"
) => {
  const message =
    error?.response?.data?.message ??
    fallbackMessage;

  toast.error(message);
};
