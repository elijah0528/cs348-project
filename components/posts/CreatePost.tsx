'use client';

import { useState } from "react";

interface CreatePostProps {
  subredditId: string;
  userId: string;
  onSuccess: () => void;
}

export default function CreatePost({ subredditId, userId, onSuccess }: CreatePostProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/reddit/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), content: content.trim(), subreddit_id: subredditId, user_id: userId }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create post");
      }
      setTitle("");
      setContent("");
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl mb-4">Create Post</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        <div>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border p-2"
            required
          />
        </div>
        <div>
          <textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border p-2 h-28"
            required
          />
        </div>
        <button type="submit" disabled={loading} className="bg-green-500 text-white px-4 py-2 rounded">
          {loading ? "Posting..." : "Post"}
        </button>
        {error && <p className="text-red-600">{error}</p>}
      </form>
    </div>
  );
} 