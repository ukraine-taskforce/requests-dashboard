import React from "react";

export interface AuthContextValue {
  isLoggedIn: boolean;
  user?: {
    name: string;
  };
  login: () => void;
  logout: () => void;
}

const AuthContext = React.createContext<AuthContextValue>({
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
});

export function useAuth() {
  return React.useContext(AuthContext);
}

export const AuthProvider: React.FunctionComponent = ({ children }) => {
  const [user, setUser] = React.useState<{ name: string }>();

  const login = React.useCallback(() => {
    setUser({ name: "mock" });
  }, [setUser]);

  const logout = React.useCallback(() => {
    setUser(undefined);
  }, [setUser]);

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        user,
        isLoggedIn: Boolean(user),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
