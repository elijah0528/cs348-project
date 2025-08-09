import Link from "next/link";
import { Subreddit } from "@/components/types";
import Image from "next/image";
import { getUser } from "@/lib/auth";
import { getSubreddits, getUserMembership } from "@/lib/subreddit-data";
import LogoutButton from "@/components/sidebar/LogoutButton";
import SubredditActionButton from "@/components/sidebar/SubredditActionButton";
import CreateSubredditWrapper from "@/components/sidebar/CreateSubredditWrapper";
import { Button } from "@/components/ui/button";
import DeleteAccountButton from "./sidebar/DeleteAccountButton";
import AppLayout from "./AppLayout";

export default async function SidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side data fetching
  const user = await getUser();
  const subreddits = await getSubreddits();
  const myIds = user ? await getUserMembership(user.user_id) : [];

  const mySubs = subreddits.filter(
    (s) =>
      myIds.includes(s.subreddit_id) || (user && s.username === user.username)
  );
  const otherSubs = subreddits.filter((s) => !myIds.includes(s.subreddit_id));

  return (
    <AppLayout
      user={user}
      initialSubreddits={subreddits}
      initialMyIds={myIds}
    >
      <aside className="sidebar p-4 bg-gray-100 rounded-lg shadow-md">
        <header className="sidebar-header mb-4">
          <h1 className="text-xl font-bold text-gray-700">Welcome, {user ? user.username : "Guest"}</h1>
          <div className="user-actions flex space-x-2 mt-2">
            <LogoutButton />
            <DeleteAccountButton />
          </div>
        </header>
        <section className="mb-4">
          <CreateSubredditWrapper />
        </section>
        <section className="subreddits">
          <h2 className="text-lg font-semibold text-gray-600 mb-2">My Subreddits</h2>
          {mySubs.length > 0 ? (
            <ul>
              {mySubs.map((subreddit) => (
                <li key={subreddit.subreddit_id} className="mb-1">
                  <SubredditButton
                    subreddit={subreddit}
                    actionButton={<SubredditActionButton subreddit={subreddit} />}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No subreddits found. Join or create one!</p>
          )}
          <h2 className="text-lg font-semibold text-gray-600 mt-4 mb-2">Other Subreddits</h2>
          {otherSubs.length > 0 ? (
            <ul>
              {otherSubs.map((subreddit) => (
                <li key={subreddit.subreddit_id} className="mb-1">
                  <SubredditButton subreddit={subreddit} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No other subreddits available.</p>
          )}
        </section>
      </aside>
      {children}
    </AppLayout>
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
    <div className="relative flex items-center h-8 group bg-white rounded-md shadow hover:bg-gray-50 transition">
      <Link href={`/r/${subreddit.name}`} className="block h-full w-full pl-2 text-gray-700 font-medium">
        {subreddit.name}
      </Link>
      {actionButton && (
        <div className="absolute right-1 top-1/2 -translate-y-1/2 group-hover:opacity-100 opacity-0 transition-opacity">
          {actionButton}
        </div>
      )}
    </div>
  );
}