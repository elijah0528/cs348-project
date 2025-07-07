import Dashboard from "@/components/dashboard/Dashboard";
import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function App() {
  const user = await getUser();

  if (!user) {
    redirect("/auth");
  }

  return <Dashboard user={user} />;
}
