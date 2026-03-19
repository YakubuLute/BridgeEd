import { Navigate, Outlet } from "react-router-dom";

import { readSession } from "../../../utils/session";
import { getPostLoginPath } from "../../../utils/role-routing";

export const PublicRoute = (): JSX.Element => {
  const session = readSession();

  if (session) {
    return <Navigate replace to={getPostLoginPath(session.user)} />;
  }

  return <Outlet />;
};
