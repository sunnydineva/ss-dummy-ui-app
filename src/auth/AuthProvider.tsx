import React, { createContext, useContext, useEffect, useState } from "react";
import keycloak from "./keycloak";

type AuthState = {
  ready: boolean;
  authenticated: boolean;
  initError?: string;
};

const AuthContext = createContext<AuthState>({ ready: false, authenticated: false });

export function AuthProvider({
  children,
  mode,
}: {
  children: React.ReactNode;
  mode: "login-required" | "check-sso";
}) {
  const [state, setState] = useState<AuthState>({ ready: false, authenticated: false });

  useEffect(() => {
    let cancelled = false;

    keycloak
      .init({
        onLoad: mode,
        pkceMethod: "S256",
        checkLoginIframe: false,
        // silentCheckSsoRedirectUri: window.location.origin + "/silent-check-sso.html",
      })
      .then((auth) => {
        if (cancelled) return;
        setState({ ready: true, authenticated: auth });
      })
      .catch((e) => {
        if (cancelled) return;
        setState({ ready: true, authenticated: false, initError: String(e) });
      });

    return () => {
      cancelled = true;
    };
  }, [mode]);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}