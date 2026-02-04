// src/hooks/useBackendForm.ts

import { useState } from "react";

/**
 * Backend validation errors
 * Format:
 * {
 *   field: ["error message"]
 * }
 */
type Errors<T> = Partial<Record<keyof T, string[]>>;

export function useBackendForm<T extends Record<string, any>>(
  initialValues: T
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Errors<T>>({});
  const [loading, setLoading] = useState(false);

  /* ================= FIELD UPDATE ================= */

  const setField = <K extends keyof T>(
    key: K,
    value: T[K]
  ) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  /* ================= BACKEND ERROR HANDLER ================= */

  const handleError = (error: any) => {
    if (error?.response?.status === 422) {
      setErrors(error.response.data?.errors || {});
    }
  };

  /* ================= RESET ================= */

  const reset = () => {
    setValues(initialValues);
    setErrors({});
  };

  return {
    values,
    errors,
    loading,

    // setters
    setField,
    setLoading,

    // helpers
    handleError,
    reset,
  };
}
