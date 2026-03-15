import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Role } from "@bridgeed/shared";

import { readSession } from "../../../utils/session";
import { hasAnyAllowedRole, getPostLoginPath } from "../../../utils/role-routing";
import { DashboardLayout } from "../../dashboard/components/DashboardLayout";

type RequireAuthProps = {
  allowedRoles?: Role[];
  requireLayout?: boolean;
};

export const RequireAuth = ({
  allowedRoles,
  requireLayout = true
}: RequireAuthProps): JSX.Element => {
  const session = readSession();
  const location = useLocation();

  if (!session) {
    return <Navigate replace state={{ from: location }} to="/" />;
  }

  if (allowedRoles && allowedRoles.length > 0 && !hasAnyAllowedRole(session.user, allowedRoles)) {
    return <Navigate replace to={getPostLoginPath(session.user)} />;
  }

  if (requireLayout) {
    return (
      <DashboardLayout role={session.user.role}>
        <Outlet />
      </DashboardLayout>
    );
  }

  return <Outlet />;
};
