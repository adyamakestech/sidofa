"use client";

import { createContext, useContext, useState } from "react";

interface AuthContextType {
  user: any;
  setUser: (user: any) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  refreshUser: async () => {},
});

export function AuthProvider({
  children,
  user: initialUser,
}: {
  children: React.ReactNode;
  user: any;
}) {
  const [user, setUser] = useState(initialUser);

  const refreshUser = async () => {
    const res = await fetch("/api/auth/me", {
      credentials: "include",
    });

    if (!res.ok) return;

    const data = await res.json();
    setUser(data);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
