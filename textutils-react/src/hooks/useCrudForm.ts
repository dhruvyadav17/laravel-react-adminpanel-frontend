import { useState } from "react";
import { execute } from "../utils/execute";

/* ================= TYPES ================= */

type MutationFn = (arg: any) => any;

type Errors<T> = Partial<Record<keyof T, string[]>>;

type Options<T> = {
  initialValues: T;

  create?: MutationFn;
  update?: MutationFn;
  remove?: MutationFn;

  onSuccess?: () => void;
  successMessage?: string;
  variant?: "success" | "danger";
};

/* ===================================================== */
/* ================= MAIN HOOK ========================= */
/* ===================================================== */

export function useCrudForm<T extends Record<string, any>>(
  options: Options<T>
) {
  const {
    initialValues,
    create,
    update,
    remove,
    onSuccess,
    successMessage,
    variant = "success",
  } = options;

  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Errors<T>>({});
  const [loading, setLoading] = useState(false);

  /* ================= FIELD ================= */

  const setField = <K extends keyof T>(
    key: K,
    value: T[K]
  ) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  /* ================= SET VALUES (FOR EDIT SYNC) ================= */

  const setAllValues = (newValues: T) => {
    setValues(newValues);
    setErrors({});
  };

  /* ================= RESET ================= */

  const reset = () => {
    setValues(initialValues);
    setErrors({});
  };

  /* ================= ERROR HANDLER ================= */

  const handleError = (error: any) => {
    if (error?.response?.status === 422) {
      setErrors(error.response.data?.errors || {});
    }
  };

  /* ================= CREATE ================= */

  const handleCreate = async () => {
    if (!create) return;

    try {
      setLoading(true);

      await execute(
        () => create(values).unwrap(),
        {
          defaultMessage:
            successMessage ?? "Created successfully",
          variant,
        }
      );

      reset();
      onSuccess?.();
    } catch (e) {
      handleError(e);
    } finally {
      setLoading(false);
    }
  };

  /* ================= UPDATE ================= */

  const handleUpdate = async (id: number) => {
    if (!update) return;

    try {
      setLoading(true);

      await execute(
        () => update({ id, ...values }).unwrap(),
        {
          defaultMessage:
            successMessage ?? "Updated successfully",
          variant,
        }
      );

      reset();
      onSuccess?.();
    } catch (e) {
      handleError(e);
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE ================= */

  const handleRemove = async (id: number) => {
    if (!remove) return;

    return execute(
      () => remove(id).unwrap(),
      {
        defaultMessage: "Deleted successfully",
        variant: "danger",
      }
    );
  };

  return {
    values,
    errors,
    loading,

    setField,
    setAllValues, // for edit sync
    reset,

    create: handleCreate,
    update: handleUpdate,
    remove: handleRemove,
  };
}
