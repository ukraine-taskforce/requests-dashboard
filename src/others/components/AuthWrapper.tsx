import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import { AuthStatus, useAuth } from "../contexts/auth";

export interface AuthWrapperProps {}

export const AuthWrapper: React.FunctionComponent<AuthWrapperProps> = () => {
  const { status } = useAuth();
  const location = useLocation();

  if (status === AuthStatus.Loading) {
    return null;
  }

  if (status === AuthStatus.SignedOut) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};
