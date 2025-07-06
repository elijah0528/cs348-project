"use client";

import { useState, useEffect } from "react";
import AuthPage from "@/components/auth/AuthPage";
import Dashboard from "@/components/dashboard/Dashboard";
import { User } from "@/components/types";

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  // Load user from localStorage on first render
  useEffect(() => {
    try {
      const stored = typeof window !== "undefined" ? localStorage.getItem("weddit_user") : null;
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to parse stored user", e);
    }
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    if (typeof window !== "undefined") {
      localStorage.setItem("weddit_user", JSON.stringify(userData));
    }
  };

  const handleLogout = () => {
    setUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("weddit_user");
    }
  };

  if (!user) {
    return <AuthPage onUserLogin={handleLogin} />;
  }

  return <Dashboard user={user} onLogout={handleLogout} />;
}
