"use client";

import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import { useStore } from "@nanostores/react";
import { authClient } from "@/lib/auth-client";

type Session = typeof authClient.$Infer.Session;

interface AuthContextType {
  user: Session["user"] | null;
  session: Session["session"] | null;
  isPending: boolean;
  refetch: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const session = useStore(authClient.useSession);

  const value: AuthContextType = {
    user: session.data?.user ?? null,
    session: session.data?.session ?? null,
    isPending: session.isPending,
    refetch: async () => {
      await session.refetch();
    },
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
