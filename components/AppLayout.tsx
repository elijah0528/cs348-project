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
      console.error("Failed to refresh sidebar", err);
    }
  };

  return (
    <AppContext.Provider value={{ refreshSidebar }}>
      <div className="flex h-full bg-stone-100">
        <SidebarClient
          user={user}
          subreddits={subreddits}
          myIds={myIds}
          key={refreshTrigger}
        />
        
        <div className="flex-1 p-1.5">
          <div className="size-full overflow-hidden bg-white border border-stone-200 rounded-xl">
            <SplitLayoutProvider user={user}>
              {children}
            </SplitLayoutProvider>
          </div>
        </div>
      </div>
    </AppContext.Provider>
  );
}
