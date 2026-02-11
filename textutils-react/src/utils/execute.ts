import {
  handleApiError,
  handleApiSuccess,
} from "./toastHelper";

type ExecuteOptions = {
  defaultMessage?: string;
  variant?: "success" | "danger";
  silent?: boolean; // 🔥 optional: disable success toast
};

export async function execute<T>(
  fn: () => Promise<T>,
  options: ExecuteOptions = {}
): Promise<T> {
  const {
    defaultMessage = "Action completed successfully",
    variant = "success",
    silent = false,
  } = options;

  try {
    const result = await fn();

    if (!silent) {
      const message =
        typeof (result as any)?.message === "string" &&
        (result as any).message.trim().length > 0
          ? (result as any).message
          : defaultMessage;

      handleApiSuccess(
        { message },
        defaultMessage,
        variant
      );
    }

    return result;
  } catch (error) {
    handleApiError(error);
    throw error; // 🔥 important: keep promise chain intact
  }
}
