// src/utils/execute.ts

import {
  handleApiError,
  handleApiSuccess,
} from "./toastHelper";

/* =====================================================
   EXECUTE
   -----------------------------------------------------
   Central async executor
   RULES:
   - Success toast ONLY once
   - Backend message preferred
   - Errors never swallowed
===================================================== */

export async function execute<T>(
  fn: () => Promise<T>,
  successFallback?: string
): Promise<T> {
  try {
    const res: any = await fn();

    /**
     * 🔔 Success handling
     * - If backend sends message → use it
     * - Else use fallback (if provided)
     * - If neither → no toast (silent success)
     */
    if (successFallback || res?.data?.message) {
      handleApiSuccess(res, successFallback);
    }

    return res;
  } catch (error) {
    /**
     * ❌ Error handling
     * - Centralized toast
     * - Let caller decide next step
     */
    handleApiError(error);
    throw error; // 🔥 NEVER swallow
  }
}
