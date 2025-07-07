import Link from "next/link";
import { Subreddit } from "@/components/types";
import Image from "next/image";
import { getUser } from "@/lib/auth";
import { getSubreddits, getUserMembership } from "@/lib/subreddit-data";
import LogoutButton from "@/components/sidebar/LogoutButton";
import SubredditActionButton from "@/components/sidebar/SubredditActionButton";
import CreateSubredditWrapper from "@/components/sidebar/CreateSubredditWrapper";

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
    <div className="flex h-full bg-stone-100">
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
          {otherSubs.length > 0 && (
            <div className="flex flex-col gap-1.5 w-full">
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
        </div>
        {user && (
          <div className="flex items-center justify-between">
            <Link
              href={`/user/${user.user_id}`}
              className="text-sm font-medium underline"
            >
              u/{user.username}
            </Link>
            <LogoutButton />
          </div>
        )}
      </div>

      <div className="flex-1 p-1.5">
        <div className="size-full overflow-y-auto bg-white border border-stone-200 rounded-xl">
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
        className="flex w-full justify-start items-center h-full px-2 rounded-md group-hover:bg-stone-200/50 text-left cursor-pointer"
      >
        r/{subreddit.subreddit_name}
      </Link>
    </div>
  );
}
