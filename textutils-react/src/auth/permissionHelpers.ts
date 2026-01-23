import { PERMISSIONS } from "../constants/permissions";
import { AuthState } from "../types/auth";

export const canManageUsers = (auth: AuthState) =>
  auth.can(PERMISSIONS.USER.VIEW);

export const canManageRoles = (auth: AuthState) =>
  auth.can(PERMISSIONS.ROLE.MANAGE);

export const canManagePermissions = (auth: AuthState) =>
  auth.can(PERMISSIONS.PERMISSION.MANAGE);

export const canImpersonateUser = (auth: AuthState) =>
  auth.can(PERMISSIONS.SYSTEM.IMPERSONATE);
