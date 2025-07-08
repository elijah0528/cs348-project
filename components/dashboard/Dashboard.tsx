"use client";

import { useState, useEffect } from "react";
import { User, Subreddit, Post } from "../types";
import PostCard from "../posts/PostCard";

type Vote = -1 | 1;

export default function Dashboard({ user }: { user: User }) {
  const [subreddits, setSubreddits] = useState<Subreddit[]>([]);
  const [myIds, setMyIds] = useState<string[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [sort, setSort] = useState<"recent" | "popular">("recent");

  const fetchSubreddits = async () => {
    const res = await fetch("/api/reddit/subreddits");
    const data = await res.json();
    setSubreddits(data.subreddits || []);
  };

  const fetchMembership = async () => {
    const res = await fetch(`/api/reddit/membership/${user.user_id}`);
    const data = await res.json();
    setMyIds(data.subredditIds || []);
  };

  const fetchPosts = async (subredditId?: string | null) => {
    if (subredditId) {
      const res = await fetch(
        `/api/reddit/subreddits/${subredditId}?sort=${sort}`
      );
      const data = await res.json();
      setPosts(data.posts || []);
    } else {
      const res = await fetch(`/api/reddit/feed/${user.user_id}?sort=${sort}`);
      const data = await res.json();
      setPosts(data.posts || []);
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchSubreddits();
    fetchMembership();
  }, [sort]);

  const mySubs = subreddits.filter((s) => myIds.includes(s.subreddit_id));
  const otherSubs = subreddits.filter((s) => !myIds.includes(s.subreddit_id));

  const handleJoin = async (subId: string) => {
    await fetch(`/api/reddit/subreddits/${subId}/join`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: user.user_id }),
    });
    fetchMembership();
  };

  const handleVote = async (postId: string, vote: Vote | 0) => {
    const res = await fetch(`/api/reddit/posts/${postId}/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: user.user_id, vote_type: vote }),
    });
    const data = await res.json();
    setPosts((prev) =>
      prev.map((p) => (p.post_id === postId ? { ...p, score: data.score } : p))
    );
  };

  return (
    <div className="p-6 overflow-y-auto flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <h2 className="text-xl">Your Feed</h2>
        <div className="text-sm space-x-2">
          <button
            className={sort === "recent" ? "underline" : ""}
            onClick={() => setSort("recent")}
          >
            Recent
          </button>
          <button
            className={sort === "popular" ? "underline" : ""}
            onClick={() => setSort("popular")}
          >
            Popular
          </button>
        </div>
      </div>

      {/* Post list */}
      {posts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {posts.map((p) => (
            <PostCard key={p.post_id} post={p} handleVote={handleVote} />
          ))}
        </div>
      )}
    </div>
  );
}
