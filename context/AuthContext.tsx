"use client";

import { createContext, useContext } from "react";

interface AuthContextType {
  user: any;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
});

export function AuthProvider({
  children,
  user,
}: {
  children: React.ReactNode;
  user: any;
}) {
  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
