import { useState, useEffect } from "react";
import CreateSubreddit from "../subreddits/CreateSubreddit";
import SubredditList from "../subreddits/SubredditList";
import { User, Subreddit } from "../types";

type DashboardTypes = {
  user: User;
  onLogout: () => void;
};

export default function Dashboard({ user, onLogout }: DashboardTypes) {
  const [subreddits, setSubreddits] = useState<Subreddit[]>([]);

  const fetchSubreddits = async () => {
    try {
      const response = await fetch("/api/reddit/subreddits");
      if (!response.ok) throw new Error("Failed to fetch subreddits");
      const data = await response.json();
      setSubreddits(data.subreddits || []);
    } catch (error) {
      console.error(error);
      setSubreddits([]);
    }
  };

  useEffect(() => {
    fetchSubreddits();
  }, []);

  const handleDeleteAccount = async () => {
    try {
      const response = await fetch("/api/reddit/auth/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.user_id }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Account deletion failed");
      }
      onLogout();
    } catch (error: any) {
      console.error(error);
    }
  };

  const userSubreddits = subreddits.filter((s) => s.username === user.username);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <h1 className="text-2xl">Weddit</h1>
        <div>
          <span className="mr-4">{user.username}</span>
          <button onClick={onLogout} className="mr-2 bg-gray-500 text-white px-4 py-2 rounded">
            Logout
          </button>
          <button onClick={handleDeleteAccount} className="bg-red-500 text-white px-4 py-2 rounded">
            Delete Account
          </button>
        </div>
      </div>

      <CreateSubreddit 
        userId={user.user_id}
        onSuccess={fetchSubreddits}
      />

      <SubredditList
        subreddits={subreddits}
        userSubreddits={userSubreddits}
        userId={user.user_id}
        onDelete={fetchSubreddits}
      />
    </div>
  );
} 