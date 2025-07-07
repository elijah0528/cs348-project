"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Post, Comment } from "@/components/types";

export default function UserPage() {
  const { id } = useParams<{ id: string }>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [username, setUsername] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      setError(null);
      try {
        const res = await fetch(`/api/reddit/user/${id}`);
        if (!res.ok) {
          const e = await res.json();
          throw new Error(e.error || "Failed to fetch user data");
        }
        const data = await res.json();
        setUsername(data.user.username);
        setPosts(data.posts || []);
        setComments(data.comments || []);
      } catch (err: any) {
        setError(err.message);
      }
    };
    fetchData();
  }, [id]);

  if (error) return <div className="p-8">{error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-6">u/{username}'s Activity</h1>

      <section className="mb-8">
        <h2 className="text-xl mb-4">Posts</h2>
        {posts.length === 0 ? (
          <p>No posts yet.</p>
        ) : (
          posts.map((post) => (
            <div key={post.post_id} className="border p-4 mb-3">
              <h3 className="text-lg">{post.title}</h3>
              <p className="text-sm text-stone-600 mb-2">
                r/{post.subreddit_name} •{" "}
                {new Date(post.created_at).toLocaleString()}
              </p>
              <p>{post.content}</p>
            </div>
          ))
        )}
      </section>

      <section>
        <h2 className="text-xl mb-4">Comments</h2>
        {comments.length === 0 ? (
          <p>No comments yet.</p>
        ) : (
          comments.map((c) => (
            <div key={c.comment_id} className="border p-4 mb-3">
              <p className="text-sm text-stone-600 mb-1">
                On {c.post_title} in r/{c.subreddit_name} •{" "}
                {new Date(c.created_at).toLocaleString()}
              </p>
              <p>{c.content}</p>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
