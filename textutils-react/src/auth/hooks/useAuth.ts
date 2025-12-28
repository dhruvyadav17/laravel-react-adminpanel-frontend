import { useSelector } from "react-redux";
import { RootState } from "../../store";

export function useAuth() {
  const user = useSelector((s: RootState) => s.auth.user);
  const permissions = useSelector((s: RootState) => s.auth.permissions);

  const roles = user?.roles || [];

  return {
    user,
    permissions,
    isAuth: !!user,
    isAdmin: roles.includes("admin") || roles.includes("super-admin"),
    isSuperAdmin: roles.includes("super-admin"),
  };
}
