"use client";

import { useState } from "react";
import AuthPage from "@/components/auth/AuthPage";
import Dashboard from "@/components/dashboard/Dashboard";
import { User } from "@/components/types";

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <AuthPage onUserLogin={handleLogin} />;
  }

  return <Dashboard user={user} onLogout={handleLogout} />;
}
