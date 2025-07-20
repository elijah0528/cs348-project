"use client";

import { useState, useEffect } from "react";
import { Post, User } from "@/components/types";
import CreatePost from "@/components/posts/CreatePost";
import PostCard from "@/components/posts/PostCard";
import { useSplitLayout } from "@/components/layout/SplitLayout";
import JoinSubredditButton from "./JoinSubredditButton";

type Vote = -1 | 1;

interface SubredditClientProps {
  subredditId: string;
  subredditName: string;
  initialPosts: Post[];
  user: User;
}

export default function SubredditClient({
  subredditId,
  subredditName,
  initialPosts,
  user,
}: SubredditClientProps) {
  const { selectedPostId } = useSplitLayout();
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [isMember, setIsMember] = useState<boolean | null>(null);
  const [postVotes, setPostVotes] = useState<Record<string, Vote | null>>(()=>{
    const votes: Record<string, Vote | null> = {};
    initialPosts.forEach((p: any) => {
      if (typeof p.my_vote === "number" && p.my_vote !== 0) {
        votes[p.post_id] = p.my_vote as Vote;
      }
    });
    return votes;
  });
  const [sort, setSort] = useState<"popular" | "recent">("popular");

  const handleVote = async (postId: string, vote: Vote) => {
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

  const refreshPosts = async (sortType?: "popular" | "recent") => {
    const currentSort = sortType || sort;
    const res = await fetch(`/api/reddit/subreddits/${subredditId}?sort=${currentSort}&user_id=${user.user_id}`);
    if (res.ok) {
      const data = await res.json();
      const fetched = data.posts || [];
      setPosts(fetched);
      const votes: Record<string, Vote | null> = {};
      fetched.forEach((p: any) => {
        if (typeof p.my_vote === "number" && p.my_vote !== 0) {
          votes[p.post_id] = p.my_vote as Vote;
        }
      });
      setPostVotes(votes);
    }
  };

  // load saved on mount and check membership
  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem(`subSort-${subredditId}`) : null;
    if (saved === "recent" || saved === "popular") {
      setSort(saved as "popular" | "recent");
      // refresh posts with the restored sort
      refreshPosts(saved as "popular" | "recent");
    }
    
    // check membership
    const checkMembership = async () => {
      try {
        const res = await fetch(`/api/reddit/subreddits/${subredditId}/membership?user_id=${user.user_id}`);
        const data = await res.json();
        setIsMember(data.isMember);
      } catch (error) {
        console.error("Failed to check membership:", error);
        setIsMember(false);
      }
    };
    
    checkMembership();
  }, [subredditId, user.user_id]);

  const handleSortChange = async (newSort: "popular" | "recent") => {
    if (typeof window !== "undefined") {
      localStorage.setItem(`subSort-${subredditId}`, newSort);
    }
    setSort(newSort);
    await refreshPosts(newSort);
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-semibold">r/{subredditName}</h1>
          <div className="text-sm space-x-2">
            <button
              className={sort === "popular" ? "underline" : ""}
              onClick={() => handleSortChange("popular")}
            >
              Popular
            </button>
            <button
              className={sort === "recent" ? "underline" : ""}
              onClick={() => handleSortChange("recent")}
            >
              Recent
            </button>
          </div>
        </div>
        {isMember ? (
          <CreatePost
            subredditId={subredditId}
            userId={user.user_id}
            onSuccess={refreshPosts}
          />
        ) : (
          <JoinSubredditButton
            subredditId={subredditId}
            userId={user.user_id}
            onSuccess={() => {
              setIsMember(true);
              refreshPosts();
            }}
          />
        )}
      </div>

      {posts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        <div className={`grid gap-4 ${selectedPostId ? 'grid-cols-1 xl:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`} style={{ minWidth: selectedPostId ? '400px' : 'auto' }}>
          {posts.map((p) => (
            <PostCard key={p.post_id} post={p} handleVote={handleVote} postVote={postVotes[p.post_id]} />
          ))}
        </div>
      )}
    </div>
  );
}
