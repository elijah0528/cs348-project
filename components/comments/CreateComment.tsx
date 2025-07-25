'use client';

import { useState } from "react";

interface CreateCommentProps {
  postId: string;
  userId: string;
  onSuccess: () => void;
}

export default function CreateComment({ postId, userId, onSuccess }: CreateCommentProps) {
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/reddit/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: content.trim(), post_id: postId, user_id: userId }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to add comment");
      }
      setContent("");
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <textarea
        placeholder="Add a comment"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full border border-stone-200 p-2 h-24 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <button type="submit" disabled={loading} className="bg-black hover:bg-black/80 text-white px-4 py-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
        {loading ? "Posting..." : "Comment"}
      </button>
      {error && <p className="text-red-600">{error}</p>}
    </form>
  );
} 