export function initAdminLTE() {
  const win = window as any;

  // Sidebar
  if (win?.AdminLTE?.Sidebar) {
    new win.AdminLTE.Sidebar(
      document.querySelector(".app-sidebar")
    );
  }

  // Treeview
  document
    .querySelectorAll('[data-lte-toggle="treeview"]')
    .forEach((el) => {
      if (win?.AdminLTE?.Treeview) {
        new win.AdminLTE.Treeview(el);
      }
    });
}
