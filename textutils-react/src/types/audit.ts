// src/types/audit.ts

import type { ID, Timestamp } from "./models";

/* =====================================================
   AUDIT LOG
   -----------------------------------------------------
   Matches:
   - audit_logs table
   - /admin/audit-logs API response
===================================================== */

export type AuditLog = {
  id: ID;

  /* ================= ACTOR ================= */
  user_id?: ID | null;
  user_name?: string | null;     // backend join / accessor
  user_email?: string | null;

  /* ================= ACTION ================= */
  action: string;                // login, logout, role-assigned, permission-changed
  description?: string | null;   // optional human readable text

  /* ================= TARGET ================= */
  model?: string | null;         // User, Role, Permission, etc
  model_id?: ID | null;

  /* ================= CONTEXT ================= */
  ip_address?: string | null;
  user_agent?: string | null;

  /* ================= META ================= */
  old_values?: Record<string, any> | null;
  new_values?: Record<string, any> | null;

  /* ================= TIMESTAMPS ================= */
  created_at: Timestamp;
};
