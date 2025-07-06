'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import CreateSubreddit from "@/components/subreddits/CreateSubreddit";
import { Subreddit } from "@/components/types";

export default function SidebarLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ user_id: string; username: string } | null>(null);
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

  const mySubs = subreddits.filter((s) => myIds.includes(s.subreddit_id) || (user && s.username === user.username));
  const otherSubs = subreddits.filter((s) => !myIds.includes(s.subreddit_id));

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r p-4 overflow-y-auto">
        {user && (
          <div className="mb-6 border-b pb-4 flex items-center justify-between">
            <Link href={`/user/${user.user_id}`} className="text-sm font-medium underline">
              u/{user.username}
            </Link>
            <button
              onClick={() => {
                localStorage.removeItem("weddit_user");
                window.location.reload();
              }}
              className="text-xs text-gray-600"
            >
              Logout
            </button>
          </div>
        )}
        <h2 className="text-lg font-semibold mb-4">Subreddits</h2>
        <div className="mb-6">
          <h3 className="font-medium mb-2">Your Subreddits</h3>
          {mySubs.map((s) => (
            <div key={s.subreddit_id} className="flex items-center justify-between mb-1">
              <Link
                href={`/subreddit/${s.subreddit_id}`}
                className="flex-1 px-2 py-1 rounded hover:bg-gray-200 text-left"
              >
                r/{s.subreddit_name}
              </Link>
              {user && s.username === user.username ? (
                <button
                  onClick={async () => {
                    await fetch(`/api/reddit/subreddits/${s.subreddit_id}`, {
                      method: "DELETE",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ user_id: user.user_id }),
                    });
                    fetchSubreddits();
                    fetchMembership(user.user_id);
                    if (window.location.pathname.startsWith(`/subreddit/${s.subreddit_id}`)) {
                      window.location.href = "/";
                    }
                  }}
                  className="text-xs text-red-600 ml-2"
                >
                  Delete
                </button>
              ) : (
                <button
                  onClick={async () => {
                    if (!user) return;
                    await fetch(`/api/reddit/subreddits/${s.subreddit_id}/leave`, {
                      method: "DELETE",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ user_id: user.user_id }),
                    });
                    fetchMembership(user.user_id);
                    if (window.location.pathname.startsWith(`/subreddit/${s.subreddit_id}`)) {
                      window.location.href = "/";
                    }
                  }}
                  className="text-xs text-gray-600 ml-2"
                >
                  Leave
                </button>
              )}
            </div>
          ))}
        </div>
        <div>
          <h3 className="font-medium mb-2">All Subreddits</h3>
          {otherSubs.map((s) => (
            <Link
              key={s.subreddit_id}
              href={`/subreddit/${s.subreddit_id}`}
              className="block px-2 py-1 rounded hover:bg-gray-200 mb-1"
            >
              r/{s.subreddit_name}
            </Link>
          ))}
          {user && (
            <div className="mt-6">
              <CreateSubreddit
                userId={user.user_id}
                onSuccess={() => {
                  fetchSubreddits();
                  fetchMembership(user.user_id);
                }}
              />
            </div>
          )}
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
} 