"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import { User } from "@/components/types";

export default function AuthPage() {
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const router = useRouter();

  const handleUserLogin = async () => {
    // Cookie is already set by API; navigate to home to get RSC with user
    router.push('/');
    router.refresh();
  };

  return (
    <div className="p-8">
      <div className="text-2xl">Weddit</div>

      <div className="mb-4">
        <button
          onClick={() => setAuthMode("login")}
          className={`mr-2 px-4 py-2 rounded ${
            authMode === "login" ? "bg-blue-500 text-white" : "bg-stone-200"
          }`}
        >
          Login
        </button>
        <button
          onClick={() => setAuthMode("signup")}
          className={`px-4 py-2 rounded ${
            authMode === "signup" ? "bg-blue-500 text-white" : "bg-stone-200"
          }`}
        >
          Sign Up
        </button>
      </div>

      {authMode === "login" ? (
        <LoginForm onSuccess={handleUserLogin} />
      ) : (
        <SignupForm onSuccess={handleUserLogin} />
      )}
    </div>
  );
}
