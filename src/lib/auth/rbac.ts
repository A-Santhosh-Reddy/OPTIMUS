import { ROLES, Role } from "../constants";
import { SessionUser } from "./session";

export function isAuthorized(user: SessionUser | null, allowedRoles: Role[]): boolean {
  if (!user) return false;
  return allowedRoles.includes(user.role);
}

export function requireAdmin(user: SessionUser | null): boolean {
  return isAuthorized(user, [ROLES.ADMIN]);
}

export function requireAnalystOrAdmin(user: SessionUser | null): boolean {
  return isAuthorized(user, [ROLES.ADMIN, ROLES.ANALYST]);
}

export function canModifyIncident(user: SessionUser | null): boolean {
  return isAuthorized(user, [ROLES.ADMIN, ROLES.ANALYST]);
}

export function canManageBrands(user: SessionUser | null): boolean {
  return isAuthorized(user, [ROLES.ADMIN]);
}
