import { Navigate, useLocation } from "react-router-dom";

import { useLocationsQuery, useSuppliesQuery } from "../../others/contexts/api";

export function Home() {
  const location = useLocation();

  // For caching purposes
  useSuppliesQuery();
  useLocationsQuery();

  return <Navigate to="/requests" state={{ from: location }} replace />;
}
