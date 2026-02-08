import {
  handleApiError,
  handleApiSuccess,
} from "./toastHelper";

type ExecuteOptions = {
  defaultMessage?: string;
  variant?: "success" | "danger";
};

export async function execute<T>(
  fn: () => Promise<T>,
  options: ExecuteOptions = {}
): Promise<T> {
  const {
    defaultMessage = "Action completed successfully",
    variant = "success",
  } = options;

  try {
    const res: any = await fn();

    const message =
      typeof res?.message === "string" &&
      res.message.trim().length > 0
        ? res.message
        : defaultMessage;

    handleApiSuccess(
      { message },
      defaultMessage,
      variant
    );

    return res;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}
