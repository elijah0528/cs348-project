import { useState } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import { User } from "../types";

type AuthTypes = {
  onUserLogin: (user: User) => void;
};

export default function AuthPage({ onUserLogin }: AuthTypes) {
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");

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
        <LoginForm onSuccess={onUserLogin} />
      ) : (
        <SignupForm onSuccess={onUserLogin} />
      )}
    </div>
  );
}
