import { AuthenticationDetails, CognitoUser, CognitoUserPool, CognitoUserSession } from "amazon-cognito-identity-js";
import React from "react";

const userPoolId = process.env.REACT_APP_USERPOOL_ID || "";
const clientId = process.env.REACT_APP_CLIENT_ID || "";

const userPool = new CognitoUserPool({ UserPoolId: userPoolId, ClientId: clientId });

export enum AuthStatus {
  SignedIn = "SignedIn",
  SignedOut = "SignedOut",
  Loading = "Loading",
}

interface Session extends CognitoUserSession {
  accessToken: { jwtToken: string };
}

export interface AuthContextValue {
  status: AuthStatus;
  user: CognitoUser | null;
  forceSessionRefresh: () => Promise<void>
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  sendCode: (username: string) => Promise<void>;
  session: Session | null;
  confirmPassword: (code: string, username: string, newPassword: string) => Promise<void>;
}

const AuthContext = React.createContext<AuthContextValue>({
  status: AuthStatus.Loading,
  user: null,
  session: null,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  sendCode: () => Promise.resolve(),
  confirmPassword: () => Promise.resolve(),
  forceSessionRefresh: () => Promise.resolve(),
});

export function useAuth() {
  return React.useContext(AuthContext);
}

async function getUserSession(): Promise<Session> {
  const currentUser = userPool.getCurrentUser();

  return new Promise(function (resolve, reject) {
    if (!currentUser) {
      reject();
    }

    currentUser?.getSession((error: any, session: any) => {
      if (error) {
        reject(error);
      } else {
        resolve(session);
      }
    });
  });
}

async function sendUserResetCode(username: string) {
  return new Promise(function (resolve, reject) {
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

async function changeUserPassword(code: string, username: string, newPassword: string) {
  return new Promise(function (resolve, reject) {
    const nextUser = new CognitoUser({
      Username: username,
      Pool: userPool,
    });

    nextUser.confirmPassword(code, newPassword, {
      onSuccess: () => resolve(null),
      onFailure: (err: any) => reject(err),
    });
  });
}

export const AuthProvider: React.FunctionComponent = ({ children }) => {
  const [status, setStatus] = React.useState<AuthStatus>(AuthStatus.Loading);
  const [session, setSession] = React.useState<Session | null>(null);

  React.useEffect(() => {
    const getCurrentSession = async () => {
      try {
        const nextSession = await getUserSession();

        // In case we are in the initial loading of the page, we try to refresh the session
        if (status === AuthStatus.Loading && nextSession) {
          userPool.getCurrentUser()?.refreshSession(nextSession.getRefreshToken(), (err) => {
            if (err) console.error("Error refreshing session", err);
          });
        }

        setSession(nextSession);
        setStatus(AuthStatus.SignedIn);
      } catch (err) {
        setSession(null);
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
            onSuccess: () => {
              setStatus(AuthStatus.SignedIn);
              resolve(null);
            },
            onFailure: (err: any) => reject(err),
            newPasswordRequired: () => {
              nextUser.completeNewPasswordChallenge(
                password,
                {},
                {
                  onSuccess: () => {},
                  onFailure: () => {},
                }
              );
              resolve(null);
            },
          });
        });
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

  const sendCode = React.useCallback(async (username: string) => {
    try {
      await sendUserResetCode(username);
    } catch (error) {
      throw error;
    }
  }, []);

  const confirmPassword = React.useCallback(async (code: string, username: string, newPassword: string) => {
    try {
      await changeUserPassword(code, username, newPassword);
    } catch (error) {
      throw error;
    }
  }, []);

  const forceSessionRefresh = React.useCallback(async () => {
    setStatus(AuthStatus.Loading);
  }, [setStatus]);

  return (
    <AuthContext.Provider
      value={{
        forceSessionRefresh,
        login,
        logout,
        sendCode,
        confirmPassword,
        status,
        session,
        user: userPool.getCurrentUser(),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
