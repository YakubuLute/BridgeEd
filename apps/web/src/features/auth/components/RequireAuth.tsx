import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { Role } from "@bridgeed/shared";

import { getPostLoginPath, hasAnyAllowedRole } from "../../../utils/role-routing";
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

  if (allowedRoles && allowedRoles.length > 0 && !hasAnyAllowedRole(session.user, allowedRoles)) {
    return <Navigate replace to={getPostLoginPath(session.user)} />;
  }

  return <>{children}</>;
};
