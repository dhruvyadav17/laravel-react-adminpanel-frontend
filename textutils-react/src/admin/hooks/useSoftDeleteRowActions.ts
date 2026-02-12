import { useTableActions } from "./useTableActions";

type TableActionConfig<T> =
  Parameters<typeof useTableActions<T>>[0];

type Options<T> = {
  isDeleted: (row: T) => boolean;
  activeConfig: TableActionConfig<T>;
  deletedConfig: TableActionConfig<T>;
};

export function useSoftDeleteRowActions<T>({
  isDeleted,
  activeConfig,
  deletedConfig,
}: Options<T>) {
  const activeActions = useTableActions<T>(activeConfig);
  const deletedActions = useTableActions<T>(deletedConfig);

  return (row: T) =>
    isDeleted(row)
      ? deletedActions(row)
      : activeActions(row);
}
