import { handleApiError, handleApiSuccess } from "./toastHelper";

/**
 * Central API executor
 * - shows backend message if present
 * - otherwise fallback
 */
export async function execute<T>(
  fn: () => Promise<T>,
  successFallback?: string
): Promise<T> {
  try {
    const res: any = await fn();

    handleApiSuccess(
      res,
      successFallback
    );

    return res;
  } catch (e) {
    handleApiError(e);
    throw e; // 🔥 do not swallow
  }
}
