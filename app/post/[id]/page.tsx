"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Comment, Post } from "@/components/types";
import CreateComment from "@/components/comments/CreateComment";

type Vote = -1 | 1;

export default function PostPage() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<{
    user_id: string;
    username: string;
  } | null>(null);

  // fetch user from localStorage
  useEffect(() => {
    const stored =
      typeof window !== "undefined"
        ? localStorage.getItem("weddit_user")
        : null;
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {}
    }
  }, []);

  const fetchPostData = async () => {
    if (!id) return;
    const res = await fetch(`/api/reddit/posts/${id}`);
    if (!res.ok) {
      const e = await res.json();
      setError(e.error || "Failed to fetch");
      return;
    }
    const data = await res.json();
    setPost(data.post);
    setComments(data.comments || []);
  };

  useEffect(() => {
    fetchPostData();
  }, [id]);

  const refreshPost = () => fetchPostData();

  const votePost = async (vote: Vote) => {
    if (!user) return;
    const res = await fetch(`/api/reddit/posts/${post?.post_id}/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: user.user_id, vote_type: vote }),
    });
    const data = await res.json();
    if (post) setPost({ ...post, score: data.score });
  };

  const voteComment = async (commentId: string, vote: Vote) => {
    if (!user) return;
    const res = await fetch(`/api/reddit/comments/${commentId}/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: user.user_id, vote_type: vote }),
    });
    const data = await res.json();
    setComments((prev) =>
      prev.map((c) =>
        c.comment_id === commentId ? { ...c, score: data.score } : c
      )
    );
  };

  if (error) return <div className="p-8">{error}</div>;
  if (!post) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-6 overflow-y-auto max-w-2xl mx-auto">
      <h1 className="text-2xl mb-2">{post.title}</h1>
      <p className="mb-4">{post.content}</p>
      <div className="flex items-center text-sm text-stone-600 mb-6 space-x-2">
        <span>Posted by {post.username}</span>
        <div className="flex items-center space-x-1">
          <button onClick={() => votePost(1)}>⬆️</button>
          <span>{post.score ?? 0}</span>
          <button onClick={() => votePost(-1)}>⬇️</button>
        </div>
      </div>

      <h2 className="text-xl mb-4">Comments</h2>
      {user && (
        <CreateComment
          postId={post.post_id}
          userId={user.user_id}
          onSuccess={refreshPost}
        />
      )}
      <div className="mt-6 space-y-4">
        {comments.length === 0 ? (
          <p>No comments yet.</p>
        ) : (
          comments.map((c) => (
            <div key={c.comment_id} className="border p-3">
              <p className="mb-1">{c.content}</p>
              <div className="text-sm text-stone-600 flex items-center space-x-2">
                <span>{new Date(c.created_at).toLocaleString()}</span>
                <button onClick={() => voteComment(c.comment_id, 1)}>⬆️</button>
                <span>{c.score ?? 0}</span>
                <button onClick={() => voteComment(c.comment_id, -1)}>
                  ⬇️
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
