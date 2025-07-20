"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useApp } from "../AppLayout";

interface JoinSubredditButtonProps {
  subredditId: string;
  userId: string;
  onSuccess?: () => void;
}

export default function JoinSubredditButton({ subredditId, userId, onSuccess }: JoinSubredditButtonProps) {
  const [loading, setLoading] = useState(false);
  const { refreshSidebar } = useApp();

  const handleJoin = async () => {
    setLoading(true);
    try {
      await fetch(`/api/reddit/subreddits/${subredditId}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId }),
      });
      refreshSidebar();
      onSuccess?.();
    } catch (error) {
      console.error("Failed to join subreddit:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleJoin} 
      disabled={loading}
      className="bg-black hover:bg-black/80 text-white"
    >
      {loading ? "Joining..." : "Join Subreddit"}
    </Button>
  );
}
