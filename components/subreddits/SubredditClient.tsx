"use client";

import { useState } from "react";
import { Post, User } from "@/components/types";
import CreatePost from "@/components/posts/CreatePost";
import PostCard from "@/components/posts/PostCard";

type Vote = -1 | 1;

interface SubredditClientProps {
  subredditId: string;
  subredditName: string;
  initialPosts: Post[];
  user: User;
}

export default function SubredditClient({
  subredditId,
  subredditName,
  initialPosts,
  user,
}: SubredditClientProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [postVotes, setPostVotes] = useState<Record<string, Vote | null>>({});

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

  const refreshPosts = async () => {
    const res = await fetch(`/api/reddit/subreddits/${subredditId}`);
    if (res.ok) {
      const data = await res.json();
      setPosts(data.posts || []);
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">r/{subredditName}</h1>
        <CreatePost
          subredditId={subredditId}
          userId={user.user_id}
          onSuccess={refreshPosts}
        />
      </div>

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
