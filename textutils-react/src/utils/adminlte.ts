// src/utils/adminlte.ts

export function initAdminLTE() {
  const win = window as any;

  const body = document.body;

  /* ================= BASE LAYOUT ================= */
  body.classList.add("layout-fixed");
  body.classList.remove("sidebar-collapse");

  /* ================= SIDEBAR ================= */
  const sidebarEl = document.querySelector(".app-sidebar");
  if (sidebarEl && win?.AdminLTE?.Sidebar) {
    new win.AdminLTE.Sidebar(sidebarEl);
  }

  /* ================= TREEVIEW ================= */
  document
    .querySelectorAll('[data-lte-toggle="treeview"]')
    .forEach((el) => {
      if (win?.AdminLTE?.Treeview) {
        new win.AdminLTE.Treeview(el);
      }
    });
}
