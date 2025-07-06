'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Post } from "@/components/types";
import CreatePost from "@/components/posts/CreatePost";
import Link from "next/link";

type Vote = -1 | 1;

export default function SubredditPage() {
  const { id } = useParams<{ id: string }>();
  const [name, setName] = useState<string>("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<{ user_id: string; username: string } | null>(null);

  useEffect(() => {
    if (!id) return;
    const stored = typeof window !== "undefined" ? localStorage.getItem("weddit_user") : null;
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
    const res = await fetch(`/api/reddit/posts/${postId}/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: user.user_id, vote_type: vote }),
    });
    const data = await res.json();
    setPosts((prev) => prev.map((p) => (p.post_id === postId ? { ...p, score: data.score } : p)));
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
        <CreatePost subredditId={id as string} userId={user.user_id} onSuccess={() => {
          const fetchAgain = async () => {
            const res = await fetch(`/api/reddit/subreddits/${id}`);
            if (res.ok) {
              const data = await res.json();
              setPosts(data.posts || []);
            }
          };
          fetchAgain();
        }} />
      )}

      {posts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        <div>
          {posts.map((p) => (
            <div key={p.post_id} className="border p-4 mb-4">
              <Link href={`/post/${p.post_id}`} className="text-xl mb-2 text-blue-600 underline block">
                {p.title}
              </Link>
              <p className="mb-2">{p.content}</p>
              <div className="flex items-center text-sm text-gray-600 space-x-4">
                <span>Posted by {p.username}</span>
                <span>{p.comments_count ?? 0} comments</span>
                <div className="flex items-center space-x-1">
                  <button onClick={() => votePost(p.post_id, 1)}>⬆️</button>
                  <span>{p.score ?? 0}</span>
                  <button onClick={() => votePost(p.post_id, -1)}>⬇️</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 