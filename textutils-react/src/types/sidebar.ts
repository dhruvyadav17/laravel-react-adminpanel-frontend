// src/types/sidebar.ts

export type SidebarItem = {
  label: string;
  path?: string;
  element?: JSX.Element;   // 🔥 ADD THIS
  permission?: string;
  action?: "logout";
};

export type SidebarGroup = {
  label: string;
  icon: string;
  showInMenu?: boolean;
  children: SidebarItem[];
};
