"use client";

import { useState, useEffect, createContext, useContext } from "react";
import Link from "next/link";
import { Subreddit, User } from "@/components/types";
import Image from "next/image";
import LogoutButton from "@/components/sidebar/LogoutButton";
import SubredditActionButton from "@/components/sidebar/SubredditActionButton";
import CreateSubredditWrapper from "@/components/sidebar/CreateSubredditWrapper";
import DeleteAccountButton from "./sidebar/DeleteAccountButton";

interface SidebarContextType {
  refreshSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | null>(null);

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within SidebarClient");
  }
  return context;
}

interface SidebarClientProps {
  user: User | null;
  subreddits: Subreddit[];
  myIds: string[];
}

export default function SidebarClient({ user, subreddits: initialSubreddits, myIds: initialMyIds }: SidebarClientProps) {
  const [subreddits, setSubreddits] = useState<Subreddit[]>(initialSubreddits);
  const [myIds, setMyIds] = useState<string[]>(initialMyIds);
  const [recommended, setRecommended] = useState<Subreddit[]>([]);
  const [showMoreOthers, setShowMoreOthers] = useState(false);

  const refreshSidebar = async () => {
    if (!user) return;
    
    try {
      // Fetch updated subreddits and membership
      const [subredditsRes, membershipRes, recommendedRes] = await Promise.all([
        fetch("/api/reddit/subreddits"),
        fetch(`/api/reddit/membership/${user.user_id}`),
        fetch(`/api/reddit/recommended?userId=${user.user_id}`)
      ]);
      
      const subredditsData = await subredditsRes.json();
      const membershipData = await membershipRes.json();
      const recommendedData = await recommendedRes.json();
      
      setSubreddits(subredditsData.subreddits || []);
      setMyIds(membershipData.subredditIds || []);
      setRecommended(recommendedData.recommended || []);
    } catch (error) {
      console.error("Failed to refresh sidebar:", error);
    }
  };

  const mySubs = subreddits.filter(
    (s) =>
      myIds.includes(s.subreddit_id) || (user && s.username === user.username)
  );
  // fetch latest sidebar data on initial mount
  useEffect(() => {
    refreshSidebar();
  }, []);

  // duplicate declaration removed
  const recommendedSubs = recommended.slice(0, 10);
  const recommendedIds = new Set(recommendedSubs.map((s) => s.subreddit_id));
  const otherSubs = subreddits.filter((s: Subreddit) => !myIds.includes(s.subreddit_id) && !recommendedIds.has(s.subreddit_id));
  const displayedOthers = showMoreOthers ? otherSubs : otherSubs.slice(0, 10);

  return (
    <SidebarContext.Provider value={{ refreshSidebar }}>
      <div className="w-64 py-4 px-2 max-h-full flex flex-col justify-between">
        <div className="flex flex-col overflow-y-auto gap-6 items-start">
          <Link href="/" className="flex items-center gap-1 select-none">
            <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-foreground via-foreground to-[#81745C]">
              Weddit
            </div>
            <Image src="/goose.png" alt="Logo" width={40} height={30} />
          </Link>

          {user && <CreateSubredditWrapper userId={user.user_id} />}

          {mySubs.length > 0 && (
            <div className="flex flex-col gap-1.5 w-full">
              <div className="font-medium text-[13px] text-stone-500 px-2">
                Your Subreddits
              </div>
              <div className="flex flex-col gap-0.5 text-sm">
                {mySubs.map((s) => (
                  <SubredditButton
                    key={s.subreddit_id}
                    subreddit={s}
                    actionButton={
                      user && (
                        <SubredditActionButton
                          subredditId={s.subreddit_id}
                          userId={user.user_id}
                          isOwner={s.username === user.username}
                          isMember={true}
                        />
                      )
                    }
                  />
                ))}
              </div>
            </div>
          )}
          {recommendedSubs.length > 0 && (
            <div className="flex flex-col gap-1.5 w-full">
              <div className="font-medium text-[13px] text-stone-500 px-2">
                Recommended
              </div>
              <div className="flex flex-col gap-0.5 text-sm">
                {recommendedSubs.map((s) => (
                  <SubredditButton
                    key={s.subreddit_id}
                    subreddit={s}
                    actionButton={
                      user && (
                        <SubredditActionButton
                          subredditId={s.subreddit_id}
                          userId={user.user_id}
                          isOwner={false}
                          isMember={false}
                        />
                      )
                    }
                  />
                ))}
              </div>
            </div>
          )}

          {displayedOthers.length > 0 && (
            <div className="flex flex-col gap-1.5 w-full">
              <div className="font-medium text-[13px] text-stone-500 px-2">
                All Subreddits
              </div>
              <div className="flex flex-col gap-0.5 text-sm">
                {displayedOthers.map((s: Subreddit) => (
                  <SubredditButton
                    key={s.subreddit_id}
                    subreddit={s}
                    actionButton={
                      user && (
                        <SubredditActionButton
                          subredditId={s.subreddit_id}
                          userId={user.user_id}
                          isOwner={false}
                          isMember={false}
                        />
                      )
                    }
                  />
                ))}
                {!showMoreOthers && otherSubs.length > displayedOthers.length && (
                  <button
                    onClick={() => setShowMoreOthers(true)}
                    className="text-xs text-blue-600 px-2 py-1 self-start"
                  >
                    Show more
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
        {user && (
          <div className="flex items-center justify-between">
            <Link
              href={`/user/${user.user_id}`}
              className="text-sm font-medium underline"
            >
              u/{user.username}
            </Link>
            <div className="flex justify-end gap-2">
              <DeleteAccountButton user={user} />
              <LogoutButton />
            </div>
          </div>
        )}
      </div>
    </SidebarContext.Provider>
  );
}

function SubredditButton({
  subreddit,
  actionButton,
}: {
  subreddit: Subreddit;
  actionButton?: React.ReactNode;
}) {
  return (
    <div className="relative h-8 group">
      <div className="absolute right-1 top-1/2 -translate-y-1/2 group-hover:opacity-100 opacity-0 transition-opacity">
        {actionButton}
      </div>
      <Link
        href={`/subreddit/${subreddit.subreddit_id}`}
        className="flex w-full justify-start items-center h-full px-2 rounded-md group-hover:bg-stone-200/50 text-left cursor-pointer"
      >
        r/{subreddit.subreddit_name}
      </Link>
    </div>
  );
}
