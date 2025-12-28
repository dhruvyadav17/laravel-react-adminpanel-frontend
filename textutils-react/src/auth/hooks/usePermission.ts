import { useAuth } from "./useAuth";

export function usePermission() {
  const { permissions, isSuperAdmin } = useAuth();

  return (permission: string) =>
    isSuperAdmin || permissions.includes(permission);
}
