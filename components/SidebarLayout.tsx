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
