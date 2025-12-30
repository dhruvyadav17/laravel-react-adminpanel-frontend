import { handleApiError, handleApiSuccess } from "./toastHelper";

export async function execute<T>(
  fn: () => Promise<T>,
  successMsg?: string
): Promise<T> {
  try {
    const res = await fn();
    if (successMsg) handleApiSuccess(null, successMsg);
    return res;
  } catch (e) {
    handleApiError(e);
    throw e;
  }
}
