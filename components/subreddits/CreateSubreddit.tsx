import { useState } from "react";

type CreateSubredditTypes = {
  userId: string;
  onSuccess: () => void;
};

export default function CreateSubreddit({ userId, onSuccess }: CreateSubredditTypes) {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setError(null);
    try {
      const response = await fetch("/api/reddit/subreddits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subreddit_name: name.trim(),
          admin_id: userId,
        }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Subreddit creation failed");
      }
      setName("");
      onSuccess();
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl mb-4">Create a Subreddit</h2>
      <form onSubmit={handleSubmit} className="max-w-sm">
        <div className="mb-4">
          <label className="block mb-1">Subreddit Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter subreddit name"
            className="w-full border p-2"
            required
          />
        </div>
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
          Create Subreddit
        </button>
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </form>
    </div>
  );
} 