"use client";

import { createContext, useContext, useState } from "react";
import { Subreddit, User } from "@/components/types";
import SidebarClient from "./SidebarClient";
import SplitLayoutProvider from "./layout/SplitLayout";

interface AppContextType {
  refreshSidebar: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppLayout");
  }
  return context;
}

interface AppLayoutProps {
  children: React.ReactNode;
  user: User | null;
  initialSubreddits: Subreddit[];
  initialMyIds: string[];
}

export default function AppLayout({ children, user, initialSubreddits, initialMyIds }: AppLayoutProps) {
  const [subreddits, setSubreddits] = useState<Subreddit[]>(initialSubreddits);
  const [myIds, setMyIds] = useState<string[]>(initialMyIds);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refreshSidebar = async () => {
    if (!user) return;
    try {
      const [subsRes, memRes] = await Promise.all([
        fetch("/api/reddit/subreddits"),
        fetch(`/api/reddit/membership/${user.user_id}`),
      ]);
      const subsData = await subsRes.json();
      const memData = await memRes.json();
      setSubreddits(subsData.subreddits || []);
      setMyIds(memData.subredditIds || []);
      setRefreshTrigger((p) => p + 1);
    } catch (err) {
      console.error("Error: Unable to refresh the sidebar. Please check your internet connection and try again later.", err);
    }
  };
