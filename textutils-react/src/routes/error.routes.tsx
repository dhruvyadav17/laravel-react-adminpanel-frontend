import { RouteObject } from "react-router-dom";
import Unauthorized from "../pages/errors/Unauthorized";
import NotFound from "../pages/errors/NotFound";

export const errorRoutes: RouteObject[] = [
  { path: "/admin/unauthorized", element: <Unauthorized /> },
  { path: "*", element: <NotFound /> },
];
