import AuthGuard from "../guards/AuthGuard";
import UserLayout from "../layouts/UserLayout";

import UserProfilePage from "../pages/user/Profile/UserProfilePage";
import UserRoles from "../pages/user/UserRoles";

export const userRoutes = [
  {
    element: <AuthGuard />,
    children: [
      {
        element: <UserLayout />,
        children: [
          { path: "/profile", element: <UserProfilePage /> },
          { path: "/roles", element: <UserRoles /> },
        ],
      },
    ],
  },
];
