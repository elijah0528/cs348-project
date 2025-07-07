"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Post } from "@/components/types";
import CreatePost from "@/components/posts/CreatePost";
import Link from "next/link";
import { ChevronUp, ChevronDown } from "lucide-react";
import PostCard from "@/components/posts/PostCard";

type Vote = -1 | 1;

export default function SubredditPage() {
  const { id } = useParams<{ id: string }>();
  const [name, setName] = useState<string>("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<{
    user_id: string;
    username: string;
  } | null>(null);
  const [postVotes, setPostVotes] = useState<Record<string, Vote | null>>({});

  useEffect(() => {
    if (!id) return;
    const stored =
      typeof window !== "undefined"
        ? localStorage.getItem("weddit_user")
        : null;
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {}
    }
    const fetchData = async () => {
      setError(null);
      try {
        const res = await fetch(`/api/reddit/subreddits/${id}`);
        if (!res.ok) {
          const e = await res.json();
          throw new Error(e.error || "Failed to fetch subreddit");
        }
        const data = await res.json();
        setName(data.subreddit.subreddit_name);
        setPosts(data.posts || []);
      } catch (err: any) {
        setError(err.message);
      }
    };
    fetchData();
  }, [id]);

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
    setPostVotes(prev => ({ ...prev, [postId]: newVote === 0 ? null : newVote as Vote }));
  };

  const voteComment = async (commentId: string, vote: Vote) => {
    // Implementation of voteComment function
  };

  if (error) {
    return <div className="p-8">{error}</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">r/{name}</h1>
      {user && (
        <CreatePost
          subredditId={id as string}
          userId={user.user_id}
          onSuccess={() => {
            const fetchAgain = async () => {
              const res = await fetch(`/api/reddit/subreddits/${id}`);
              if (res.ok) {
                const data = await res.json();
                setPosts(data.posts || []);
              }
            };
            fetchAgain();
          }}
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
