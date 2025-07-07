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
  user: User | null;
}

export default function SubredditClient({
  subredditId,
  subredditName,
  initialPosts,
  user,
}: SubredditClientProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [postVotes, setPostVotes] = useState<Record<string, Vote | null>>({});

  const votePost = async (postId: string, vote: Vote) => {
    if (!user) return;

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
      <h1 className="text-2xl mb-4">r/{subredditName}</h1>
      {user && (
        <CreatePost
          subredditId={subredditId}
          userId={user.user_id}
          onSuccess={refreshPosts}
        />
      )}

      {posts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        <div>
          {posts.map((p) => (
            <PostCard
              key={p.post_id}
              post={p}
              currentVote={postVotes[p.post_id]}
              onVote={user ? votePost : undefined}
              showVoting={!!user}
            />
          ))}
        </div>
      )}
    </div>
  );
}
