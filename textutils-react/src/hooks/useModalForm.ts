import { useBackendForm } from "./useBackendForm";
import { execute } from "../utils/execute";

type Options<T> = {
  onSubmit: (values: T) => Promise<any>;
  onSuccess?: () => void;

  /** NEW (optional) */
  successMessage?: string;
  variant?: "success" | "danger";
};

export function useModalForm<T extends Record<string, any>>(
  initialValues: T,
  options: Options<T>
) {
  const {
    values,
    errors,
    loading,
    setLoading,
    setField,
    handleError,
    reset,
  } = useBackendForm<T>(initialValues);

  const submit = async () => {
    try {
      setLoading(true);

      await execute(
        () => options.onSubmit(values),
        {
          defaultMessage:
            options.successMessage ??
            "Action completed successfully",
          variant: options.variant ?? "success",
        }
      );

      reset();
      options.onSuccess?.();
    } catch (e) {
      handleError(e);
    } finally {
      setLoading(false);
    }
  };

  return {
    values,
    errors,
    loading,
    setField,
    submit,
    reset,
  };
}
