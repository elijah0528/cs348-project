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
      <div className="sidebar">
        <div className="sidebar-header">
          <h1>Welcome, {user ? user.username : "Guest"}</h1>
          <div className="user-actions flex space-x-2">
            <LogoutButton />
            <DeleteAccountButton />
          </div>
        </div>
        <CreateSubredditWrapper />
        <div className="subreddits">
          <h2>My Subreddits</h2>
          {mySubs.length > 0 ? (
            mySubs.map((subreddit) => (
              <SubredditButton
                key={subreddit.subreddit_id}
                subreddit={subreddit}
                actionButton={<SubredditActionButton subreddit={subreddit} />}
              />
            ))
          ) : (
            <p>No subreddits found. Join or create one!</p>
          )}
          <h2>Other Subreddits</h2>
          {otherSubs.length > 0 ? (
            otherSubs.map((subreddit) => (
              <SubredditButton key={subreddit.subreddit_id} subreddit={subreddit} />
            ))
          ) : (
            <p>No other subreddits available.</p>
          )}
        </div>
      </div>
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
    <div className="relative h-8 group">
      <Link href={`/r/${subreddit.name}`} className="block h-full w-full pl-2">
        {subreddit.name}
      </Link>
      <div className="absolute right-1 top-1/2 -translate-y-1/2 group-hover:opacity-100 opacity-0 transition-opacity">
        {actionButton}
      </div>
    </div>
  );
}