import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import apiClient from "@/api/client";
import type { User } from "@/types";

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      apiClient.get<User>("/auth/me").then((res) => setUser(res.data)).catch(() => {
        localStorage.removeItem("access_token");
      });
    }
  }, []);

  async function login(username: string, password: string) {
    const form = new URLSearchParams({ username, password });
    const res = await apiClient.post<{ access_token: string }>("/auth/login", form, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    localStorage.setItem("access_token", res.data.access_token);
    const me = await apiClient.get<User>("/auth/me");
    setUser(me.data);
  }

  function logout() {
    localStorage.removeItem("access_token");
    setUser(null);
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
