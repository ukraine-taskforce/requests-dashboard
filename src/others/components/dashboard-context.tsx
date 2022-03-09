import { ReactNode, useState, useContext, createContext } from "react";

interface DashboardState {
  isOpen: boolean;
  toggle: () => void;
}

export const DashboardContext = createContext<DashboardState | null>(null);

export const useDashboardContext = () => {
  const dashboardContext = useContext(DashboardContext);
  if (!dashboardContext) {
    throw new Error("useDashboardContext must be used within DashboardContextProvider");
  }
  return dashboardContext;
};

interface DashboardContextProviderProps {
  children: ReactNode;
}

export const DashboardContextProvider = ({ children }: DashboardContextProviderProps) => {
  return <DashboardContext.Provider value={useDashboardState()}>{children}</DashboardContext.Provider>;
};

const useDashboardState = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);
  return {
    isOpen,
    toggle,
  };
};
