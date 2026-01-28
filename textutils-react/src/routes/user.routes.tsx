import { RouteObject } from "react-router-dom";
import AuthGuard from "../guards/AuthGuard";
import UserLayout from "../layouts/UserLayout";

import Profile from "../pages/user/Profile";
import UserRoles from "../pages/user/UserRoles";

export const userRoutes: RouteObject[] = [
  {
    element: <AuthGuard />,
    children: [
      {
        element: <UserLayout />,
        children: [
          { path: "/profile", element: <Profile /> },
          { path: "/roles", element: <UserRoles /> },
        ],
      },
    ],
  },
];
