"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Post, Comment } from "@/components/types";
import PostCard from "@/components/posts/PostCard";
import CommentCard from "@/components/posts/CommentCard";

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
          <div className="space-y-3">
            {posts.map((post) => (
              <PostCard
                key={post.post_id}
                post={post}
                handleVote={() => {}} // No voting functionality on user page
              />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-xl mb-4">Comments</h2>
        {comments.length === 0 ? (
          <p>No comments yet.</p>
        ) : (
          <div className="space-y-3">
            {comments.map((comment) => (
              <CommentCard
                key={comment.comment_id}
                comment={comment}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
