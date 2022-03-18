import { ReactNode, useState, useContext, createContext } from "react";

interface SidebarState {
  isOpen: boolean;
  toggle: () => void;
  selectedTabId: number;
  setSelectedTabId: (tabId: number) => void;
}

export const SidebarContext = createContext<SidebarState | null>(null);

export const useSidebarContext = () => {
  const sidebarContext = useContext(SidebarContext);
  if (!sidebarContext) {
    throw new Error("useSidebarContext must be used within SidebarContextProvider");
  }
  return sidebarContext;
};

interface SidebarContextProviderProps {
  children: ReactNode;
}

export const SidebarContextProvider = ({ children }: SidebarContextProviderProps) => {
  return <SidebarContext.Provider value={useSidebarState()}>{children}</SidebarContext.Provider>;
};

const useSidebarState = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTabId, setSelectedTabId] = useState(0);

  const toggle = () => setIsOpen(!isOpen);
  return {
    isOpen,
    toggle,
    selectedTabId,
    setSelectedTabId,
  };
};
