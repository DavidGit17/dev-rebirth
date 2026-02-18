import { createContext, type ReactNode, useContext } from "react";

interface InternetIdentityContextValue {
  isAuthenticated: boolean;
}

const InternetIdentityContext = createContext<InternetIdentityContextValue>({
  isAuthenticated: true,
});

export function InternetIdentityProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <InternetIdentityContext.Provider value={{ isAuthenticated: true }}>
      {children}
    </InternetIdentityContext.Provider>
  );
}

export function useInternetIdentity() {
  return useContext(InternetIdentityContext);
}
