"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CreateSubreddit from "@/components/subreddits/CreateSubreddit";
import { Subreddit } from "@/components/types";
import { Plus, Minus, Trash2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Button } from "./ui/button";

export default function SidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<{
    user_id: string;
    username: string;
  } | null>(null);
  const [subreddits, setSubreddits] = useState<Subreddit[]>([]);
  const [myIds, setMyIds] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("weddit_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {}
    }
  }, []);

  const fetchSubreddits = async () => {
    const res = await fetch("/api/reddit/subreddits");
    const data = await res.json();
    setSubreddits(data.subreddits || []);
  };

  const fetchMembership = async (uid: string) => {
    const res = await fetch(`/api/reddit/membership/${uid}`);
    const data = await res.json();
    setMyIds(data.subredditIds || []);
  };

  useEffect(() => {
    fetchSubreddits();
    if (user) fetchMembership(user.user_id);
  }, [user]);

  const mySubs = subreddits.filter(
    (s) =>
      myIds.includes(s.subreddit_id) || (user && s.username === user.username)
  );
  const otherSubs = subreddits.filter((s) => !myIds.includes(s.subreddit_id));

  return (
    <div className="flex h-full bg-stone-100">
      <div className="w-64 py-4 px-2 max-h-full flex flex-col justify-between">
        <div className="flex flex-col overflow-y-auto gap-6">
          {user && (
            <CreateSubreddit
              userId={user.user_id}
              onSuccess={() => {
                fetchSubreddits();
                fetchMembership(user.user_id);
              }}
            />
          )}

          {mySubs.length > 0 && (
            <div className="flex flex-col gap-1.5">
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
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={async (e) => {
                                e.preventDefault();
                                if (s.username === user.username) {
                                  // Delete subreddit if user owns it
                                  await fetch(
                                    `/api/reddit/subreddits/${s.subreddit_id}`,
                                    {
                                      method: "DELETE",
                                      headers: {
                                        "Content-Type": "application/json",
                                      },
                                      body: JSON.stringify({
                                        user_id: user.user_id,
                                      }),
                                    }
                                  );
                                  fetchSubreddits();
                                  fetchMembership(user.user_id);
                                } else {
                                  // Leave subreddit if user is just a member
                                  await fetch(
                                    `/api/reddit/subreddits/${s.subreddit_id}/leave`,
                                    {
                                      method: "DELETE",
                                      headers: {
                                        "Content-Type": "application/json",
                                      },
                                      body: JSON.stringify({
                                        user_id: user.user_id,
                                      }),
                                    }
                                  );
                                  fetchMembership(user.user_id);
                                }
                                if (
                                  window.location.pathname.startsWith(
                                    `/subreddit/${s.subreddit_id}`
                                  )
                                ) {
                                  window.location.href = "/";
                                }
                              }}
                              className={`flex cursor-pointer items-center justify-center size-7 rounded-md ${
                                s.username === user.username
                                  ? "hover:bg-red-100"
                                  : "hover:bg-stone-200"
                              }`}
                            >
                              {s.username === user.username ? (
                                <Trash2 className="size-3.5 text-red-700" />
                              ) : (
                                <Minus className="size-3.5" />
                              )}
                            </button>
                          </TooltipTrigger>

                          <TooltipContent side="right" sideOffset={4}>
                            {s.username === user.username
                              ? "Delete Subreddit"
                              : "Leave Subreddit"}
                          </TooltipContent>
                        </Tooltip>
                      )
                    }
                  />
                ))}
              </div>
            </div>
          )}
          {otherSubs.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <div className="font-medium text-[13px] text-stone-500 px-2">
                All Subreddits
              </div>
              <div className="flex flex-col gap-0.5 text-sm">
                {otherSubs.map((s) => (
                  <SubredditButton
                    key={s.subreddit_id}
                    subreddit={s}
                    actionButton={
                      user && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={async () => {
                                await fetch(
                                  `/api/reddit/subreddits/${s.subreddit_id}/join`,
                                  {
                                    method: "POST",
                                    headers: {
                                      "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({
                                      user_id: user.user_id,
                                    }),
                                  }
                                );
                                fetchMembership(user.user_id);
                              }}
                              className="flex cursor-pointer items-center justify-center size-7 rounded-md hover:bg-stone-200"
                            >
                              <Plus className="size-3.5" />
                            </button>
                          </TooltipTrigger>

                          <TooltipContent side="right" sideOffset={4}>
                            Join Subreddit
                          </TooltipContent>
                        </Tooltip>
                      )
                    }
                  />
                ))}
              </div>
              {/* {user && (
                <div className="mt-6">
                  <CreateSubreddit
                    userId={user.user_id}
                    onSuccess={() => {
                      fetchSubreddits();
                      fetchMembership(user.user_id);
                    }}
                  />
                </div>
              )} */}
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
            <button
              onClick={() => {
                localStorage.removeItem("weddit_user");
                window.location.reload();
              }}
              className="text-xs text-stone-600"
            >
              Logout
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 p-1.5">
        <div className="size-full overflow-y-auto bg-white border border-stone-200 rounded-lg">
          {children}
        </div>
      </div>
    </div>
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
        className="flex w-full justify-start items-center h-full px-2 rounded-md hover:bg-stone-200/50 text-left cursor-pointer"
      >
        r/{subreddit.subreddit_name}
      </Link>
    </div>
  );
}
