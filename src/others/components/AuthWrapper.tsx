import React from "react";
import { Outlet } from "react-router-dom";

export interface AuthWrapperProps {}

export const AuthWrapper: React.FunctionComponent<AuthWrapperProps> = () => {
  return (
    <React.Fragment>
      <Outlet />
    </React.Fragment>
  );
};
