import { AuthenticationDetails, CognitoUser, CognitoUserPool } from "amazon-cognito-identity-js";
// import "cross-fetch/polyfill";
import React from "react";

const userPoolId = process.env.REACT_APP_USERPOOL_ID || "";
const clientId = process.env.REACT_APP_CLIENT_ID || "";

const userPool = new CognitoUserPool({ UserPoolId: userPoolId, ClientId: clientId });

export enum AuthStatus {
  SignedIn,
  SignedOut,
  Loading,
}

export interface AuthContextValue {
  status: AuthStatus;
  user: CognitoUser | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (username: string) => Promise<void>;
}

const AuthContext = React.createContext<AuthContextValue>({
  status: AuthStatus.Loading,
  user: null,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  resetPassword: () => Promise.resolve(),
});

export function useAuth() {
  return React.useContext(AuthContext);
}

async function getUserSession() {
  const currentUser = userPool.getCurrentUser();

  new Promise(function (resolve, reject) {
    currentUser?.getSession(function (err: any, session: any) {
      if (err) {
        reject(err);
      } else {
        resolve(session);
      }
    });
  });
}

async function resetUserPassword(username: string) {
  new Promise(function (resolve, reject) {
    const nextUser = new CognitoUser({
      Username: username,
      Pool: userPool,
    });
    nextUser.forgotPassword({
      onSuccess: () => resolve(null),
      onFailure: (err: any) => reject(err),
    });
  });
}

export const AuthProvider: React.FunctionComponent = ({ children }) => {
  const [status, setStatus] = React.useState<AuthStatus>(AuthStatus.Loading);

  React.useEffect(() => {
    const getCurrentSession = async () => {
      try {
        const session: any = await getUserSession();

        window.localStorage.setItem("accessToken", `${session.accessToken.jwtToken}`);
        window.localStorage.setItem("refreshToken", `${session.refreshToken.token}`);
        setStatus(AuthStatus.SignedIn);
      } catch (err) {
        setStatus(AuthStatus.SignedOut);
      }
    };

    getCurrentSession();
  }, [status, setStatus]);

  const login = React.useCallback(
    async (username: string, password: string) => {
      if (status !== AuthStatus.SignedOut) {
        throw new Error("A user is already signed in");
      }

      setStatus(AuthStatus.Loading);

      const authenticationDetails = new AuthenticationDetails({
        Username: username,
        Password: password,
      });
      const nextUser = new CognitoUser({
        Username: username,
        Pool: userPool,
      });

      try {
        await new Promise((resolve, reject) => {
          nextUser.authenticateUser(authenticationDetails, {
            onSuccess: () => resolve(null),
            onFailure: (err: any) => reject(err),
          });
        });

        setStatus(AuthStatus.SignedIn);
      } catch (error) {
        setStatus(AuthStatus.SignedOut);
        throw error;
      }
    },
    [status, setStatus]
  );

  const logout = React.useCallback(async () => {
    userPool.getCurrentUser()?.signOut();
    setStatus(AuthStatus.SignedOut);
  }, [setStatus]);

  const resetPassword = React.useCallback(
    async (username: string) => {
      setStatus(AuthStatus.Loading);

      try {
        await resetUserPassword(username);

        setStatus(AuthStatus.SignedOut);
      } catch (error) {
        setStatus(AuthStatus.SignedOut);
        throw error;
      }
    },
    [setStatus]
  );

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        resetPassword,
        status,
        user: userPool.getCurrentUser(),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
