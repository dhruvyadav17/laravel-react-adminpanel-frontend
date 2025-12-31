import { useState } from "react";

/**
 * Backend validation errors
 * { field: ["error1", "error2"] }
 */
type Errors<T> = Partial<Record<keyof T, string[]>>;

export function useBackendForm<T extends Record<string, any>>(
  initialValues: T
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Errors<T>>({});
  const [loading, setLoading] = useState<boolean>(false);

  /**
   * Update single field & clear its error
   */
  const setField = <K extends keyof T>(
    key: K,
    value: T[K]
  ) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  /**
   * Handle Laravel validation errors (422)
   */
  const handleError = (error: any) => {
    if (error?.response?.status === 422) {
      setErrors(error.response.data?.errors || {});
    }
  };

  /**
   * Reset form to initial state
   */
  const reset = () => {
    setValues(initialValues);
    setErrors({});
  };

  return {
    values,
    errors,
    loading,

    // setters
    setLoading,
    setField,

    // helpers
    handleError,
    reset,
  };
}
