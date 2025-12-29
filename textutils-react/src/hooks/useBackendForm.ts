import { useState } from "react";

type Errors<T> = Partial<Record<keyof T, string[]>>;

export function useBackendForm<T extends Record<string, any>>(
  initialValues: T
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Errors<T>>({});
  const [loading, setLoading] = useState(false);

  const setField = <K extends keyof T>(key: K, value: T[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleError = (error: any) => {
    // Laravel validation error structure
    if (error?.response?.status === 422) {
      setErrors(error.response.data.errors || {});
    }
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
  };

  return {
    values,
    errors,
    loading,
    setLoading,
    setField,
    handleError,
    reset,
  };
}
