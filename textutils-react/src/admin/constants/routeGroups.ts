// src/constants/routeGroups.ts

export const ROUTE_GROUPS = {
  USER_MANAGEMENT: "USER_MANAGEMENT",
  SETTINGS: "SETTINGS",
} as const;

export type RouteGroup =
  (typeof ROUTE_GROUPS)[keyof typeof ROUTE_GROUPS];
