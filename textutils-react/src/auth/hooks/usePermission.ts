import { useAuth } from "./useAuth";

/**
 * Thin permission wrapper
 * ------------------------------------------------
 * This hook exists ONLY for backward compatibility.
 * Actual permission logic lives in `useAuth`.
 *
 * Recommended new usage:
 *   const { can } = useAuth();
 */
export function usePermission() {
  const { can } = useAuth();

  return can;
}
