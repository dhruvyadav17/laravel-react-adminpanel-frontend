// src/config/menu.ts

export type MenuItem = {
  label: string;
  path: string;
  permission?: string;
};

/* ================= ADMIN MENU ================= */
export const ADMIN_MENU: MenuItem[] = [
  {
    label: "Dashboard",
    path: "/admin/dashboard",
  },
  {
    label: "Profile",
    path: "/admin/profile",
  },
  {
    label: "Users",
    path: "/admin/users",
    permission: "user-view",
  },
  {
    label: "Roles",
    path: "/admin/roles",
    permission: "role-manage",
  },
  {
    label: "Permissions",
    path: "/admin/permissions",
    permission: "permission-manage",
  },
  //   {
  //   label: "Logout",
  //   path: "/admin/logout",
  // },
];

/* ================= USER MENU ================= */
export const USER_MENU: MenuItem[] = [
  {
    label: "Profile",
    path: "/profile",
  },
  {
    label: "My Roles",
    path: "/roles",
  },
];
