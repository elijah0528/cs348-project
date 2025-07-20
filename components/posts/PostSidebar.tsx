"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Comment, Post, User } from "@/components/types";
import PostClient from "./PostClient";

interface PostSidebarProps {
  postId: string | null;
  user: User | null;
  onClose: () => void;
}

export default function PostSidebar({ postId, user, onClose }: PostSidebarProps) {
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!postId) {
      setPost(null);
      setComments([]);
      return;
    }

    const fetchPost = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/reddit/posts/${postId}${user ? `?user_id=${user.user_id}` : ""}`);
        if (!res.ok) {
          const e = await res.json();
          throw new Error(e.error || "Failed to fetch post");
        }
        const data = await res.json();
        setPost(data.post);
        setComments(data.comments || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId, user]);

  if (!postId) return null;

  return (
    <div className="w-1/2 border-l border-stone-200 bg-white flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-stone-200">
        <h2 className="text-lg font-semibold">Post Details</h2>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-gray-100 transition-colors"
        >
          <X size={20} />
        </button>
      </div>
      
      <div className="flex-1 overflow-hidden">
        {loading && (
          <div className="p-6 text-center">Loading...</div>
        )}
        {error && (
          <div className="p-6 text-center text-red-500">{error}</div>
        )}
        {post && !loading && !error && (
          <PostClient post={post} initialComments={comments} user={user} />
        )}
      </div>
    </div>
  );
}
