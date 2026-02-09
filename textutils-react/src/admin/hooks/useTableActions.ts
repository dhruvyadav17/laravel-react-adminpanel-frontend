import { ICONS } from "../../constants/icons";

type ActionConfig<T> = {
  canEdit?: boolean;
  canDelete?: boolean;

  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;

  extraActions?: Array<{
    key: string;
    icon: string;
    title: string;
    variant?: "danger" | "warning" | "primary";
    show?: boolean;
    onClick: (row: T) => void;
  }>;
};

export function useTableActions<T>(
  config: ActionConfig<T>
) {
  return (row: T) => {
    const actions: any[] = [];

    if (config.onEdit && config.canEdit !== false) {
      actions.push({
        key: "edit",
        icon: ICONS.EDIT,
        title: "Edit",
        show: config.canEdit ?? true,
        onClick: () => config.onEdit?.(row),
      });
    }

    if (config.onDelete && config.canDelete !== false) {
      actions.push({
        key: "delete",
        icon: ICONS.DELETE,
        title: "Delete",
        variant: "danger",
        show: config.canDelete ?? true,
        onClick: () => config.onDelete?.(row),
      });
    }

    if (config.extraActions?.length) {
      config.extraActions.forEach((action) => {
        actions.push({
          ...action,
          onClick: () => action.onClick(row),
        });
      });
    }

    return actions;
  };
}
