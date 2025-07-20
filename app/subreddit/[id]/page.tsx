import { Post } from "@/components/types";
import { getUser } from "@/lib/auth";
import SubredditClient from "@/components/subreddits/SubredditClient";
import { redirect } from "next/navigation";

interface SubredditPageProps {
  params: { id: string };
}

export default async function SubredditPage({ params }: SubredditPageProps) {
  const { id } = await params;
  const user = await getUser();

  if (!user) {
    redirect("/auth");
  }

  let name = "";
  let posts: Post[] = [];
  let error: string | null = null;

  try {
    const res = await fetch(
      `${
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      }/api/reddit/subreddits/${id}?user_id=${user.user_id}`
    );
    if (!res.ok) {
      const e = await res.json();
      throw new Error(e.error || "Failed to fetch subreddit");
    }
    const data = await res.json();
    name = data.subreddit.subreddit_name;
    posts = data.posts || [];
  } catch (err: any) {
    error = err.message;
  }

  if (error) {
    return <div className="p-8">{error}</div>;
  }

  return (
    <SubredditClient
      subredditId={id}
      subredditName={name}
      initialPosts={posts}
      user={user}
    />
  );
}
