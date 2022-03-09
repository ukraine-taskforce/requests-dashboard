import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "../contexts/auth";

export interface AuthWrapperProps {}

export const AuthWrapper: React.FunctionComponent<AuthWrapperProps> = () => {
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <React.Fragment>
      <Outlet />
    </React.Fragment>
  );
};
