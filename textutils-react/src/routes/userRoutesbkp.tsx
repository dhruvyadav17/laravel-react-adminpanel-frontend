import Profile from "../pages/user/Profile";
import UserRoles from "../pages/user/UserRoles";

export const userRoutes = [
  { path: "/profile", element: <Profile /> },
  { path: "/roles", element: <UserRoles /> },
];
