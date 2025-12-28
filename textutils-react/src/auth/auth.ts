export function setAuth(
  token: string,
  user: any,
  permissions: string[] = []
) {
  localStorage.setItem("token", token);
  localStorage.setItem(
    "user",
    JSON.stringify({
      ...user,
      roles: Array.isArray(user.roles) ? user.roles : [],
    })
  );
  localStorage.setItem(
    "permissions",
    JSON.stringify(permissions)
  );
}

export function logout() {
  localStorage.clear();
}

export function isAuth(): boolean {
  return !!localStorage.getItem("token");
}

export function getUser() {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

export function getToken(): string | null {
  return localStorage.getItem("token");
}

/* ================= PERMISSIONS ================= */

export function hasPermission(permission: string): boolean {
  if (isSuperAdmin()) return true;

  const permissions = localStorage.getItem("permissions");
  if (!permissions) return false;

  return JSON.parse(permissions).includes(permission);
}

/* ================= ROLES ================= */

export function isAdmin(): boolean {
  const user = getUser();
  if (!user?.roles) return false;

  return user.roles.some((r: string) =>
    ["admin", "super-admin"].includes(r)
  );
}

export function isSuperAdmin(): boolean {
  const user = getUser();
  if (!user?.roles) return false;

  return user.roles.includes("super-admin");
}
