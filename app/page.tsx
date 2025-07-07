import AuthPage from "@/components/auth/AuthPage";
import Dashboard from "@/components/dashboard/Dashboard";
import { getUser } from "@/lib/auth";

export default async function App() {
  const user = await getUser();

  if (!user) {
    return <AuthPage />;
  }

  return <Dashboard user={user} />;
}
