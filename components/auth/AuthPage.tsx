"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import { User } from "../types";
import { setUserCookie } from "@/lib/auth";

export default function AuthPage() {
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const router = useRouter();

  const handleUserLogin = async (user: User) => {
    // Set the user cookie and refresh the page
    await setUserCookie(user);
    router.refresh();
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Weddit</h1>

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
