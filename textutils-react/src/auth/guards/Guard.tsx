import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

type Props = {
  admin?: boolean;
  permission?: string;
};

export default function Guard({
  admin = false,
  permission,
}: Props) {
  const { isAuth, isAdmin, can, user } = useAuth();

  /* 🔒 NOT LOGGED IN */
  if (!isAuth) {
    return (
      <Navigate
        to={admin ? "/admin/login" : "/login"}
        replace
      />
    );
  }

  /* 📧 EMAIL NOT VERIFIED (USER ONLY) */
  // if (
  //   !admin &&                       // admin routes skip
  //   user &&
  //   !user.email_verified_at         // not verified
  // ) {
  //   return <Navigate to="/verify-email" replace />;
  // }

  /* 🛡 ADMIN ACCESS */
  if (admin && !isAdmin) {
    return <Navigate to="/profile" replace />;
  }

  /* 🔐 PERMISSION CHECK */
  if (permission && !can(permission)) {
    return (
      <Navigate
        to="/admin/unauthorized"
        replace
      />
    );
  }

  return <Outlet />;
}
