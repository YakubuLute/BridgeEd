import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { Role } from "@bridgeed/shared";

import { readSession } from "../../../utils/session";

type RequireAuthProps = {
  children: ReactNode;
  allowedRoles?: Role[];
};

export const RequireAuth = ({ children, allowedRoles }: RequireAuthProps): JSX.Element => {
  const location = useLocation();
  const session = readSession();

  if (!session?.accessToken) {
    return <Navigate replace state={{ from: location.pathname }} to="/" />;
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(session.user.role)) {
    return <Navigate replace to="/role-selection" />;
  }

  return <>{children}</>;
};
