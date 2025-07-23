"use client";

import { useState, useEffect } from "react";
import { User, Subreddit, Post } from "../types";
import PostCard from "../posts/PostCard";
import { useSplitLayout } from "../layout/SplitLayout";

type Vote = -1 | 1;

export default function Dashboard({ user }: { user: User }) {
  const { selectedPostId } = useSplitLayout();
  const [subreddits, setSubreddits] = useState<Subreddit[]>([]);
  const [myIds, setMyIds] = useState<string[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [postVotes, setPostVotes] = useState<Record<string, Vote | null>>({});
  const [sort, setSort] = useState<"recent" | "popular" | "trending">("recent");

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
        `/api/reddit/subreddits/${subredditId}?sort=${sort}&user_id=${user.user_id}`
      );
      const data = await res.json();
      const fetched = data.posts || [];
      setPosts(fetched);
      const votes: Record<string, Vote | null> = {};
      fetched.forEach((p: any) => {
        if (typeof p.my_vote === "number" && p.my_vote !== 0) {
          votes[p.post_id] = p.my_vote as Vote;
        }
      });
      setPostVotes(votes);
    } else {
      const res = await fetch(`/api/reddit/feed/${user.user_id}?sort=${sort}`);
      const data = await res.json();
      const fetched = data.posts || [];
      setPosts(fetched);
      const votes: Record<string, Vote | null> = {};
      fetched.forEach((p: any) => {
        if (typeof p.my_vote === "number" && p.my_vote !== 0) {
          votes[p.post_id] = p.my_vote as Vote;
        }
      });
      setPostVotes(votes);
    }
  };

  // load saved preference once on mount
  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("feedSort") : null;
    if (saved === "recent" || saved === "popular" || saved === "trending") {
      setSort(saved as "recent" | "popular" | "trending");
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("feedSort", sort);
    }

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

  const handleVote = async (postId: string, vote: Vote) => {
    const currentVote = postVotes[postId];
    const newVote = currentVote === vote ? 0 : vote;

    const res = await fetch(`/api/reddit/posts/${postId}/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: user.user_id, vote_type: newVote }),
    });
    const data = await res.json();
    setPosts((prev) =>
      prev.map((p) => (p.post_id === postId ? { ...p, score: data.score } : p))
    );
    setPostVotes((prev) => ({
      ...prev,
      [postId]: newVote === 0 ? null : (newVote as Vote),
    }));
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
          <button
            className={sort === "trending" ? "underline" : ""}
            onClick={() => setSort("trending")}
          >
            Trending
          </button>
        </div>
      </div>

      {/* Post list */}
      {posts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        <div className={`grid gap-4 ${selectedPostId ? 'grid-cols-1 xl:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`} style={{ minWidth: selectedPostId ? '400px' : 'auto' }}>
          {posts.map((p) => (
            <PostCard key={p.post_id} post={p} handleVote={handleVote} postVote={postVotes[p.post_id]} />
          ))}
        </div>
      )}
    </div>
  );
}
