"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Comment, Post } from "@/components/types";
import CreateComment from "@/components/comments/CreateComment";
import { ChevronUp, ChevronDown } from "lucide-react";

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
  const [postVote, setPostVote] = useState<Vote | null>(null);
  const [commentVotes, setCommentVotes] = useState<Record<string, Vote | null>>({});

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
    if (!user || !post) return;
    
    const currentVote = postVote;
    const newVote = currentVote === vote ? 0 : vote;
    
    const res = await fetch(`/api/reddit/posts/${post.post_id}/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: user.user_id, vote_type: newVote }),
    });
    const data = await res.json();
    setPost({ ...post, score: data.score });
    setPostVote(newVote === 0 ? null : newVote as Vote);
  };

  const voteComment = async (commentId: string, vote: Vote) => {
    if (!user) return;
    
    const currentVote = commentVotes[commentId];
    const newVote = currentVote === vote ? 0 : vote;
    
    const res = await fetch(`/api/reddit/comments/${commentId}/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: user.user_id, vote_type: newVote }),
    });
    const data = await res.json();
    setComments((prev) =>
      prev.map((c) =>
        c.comment_id === commentId ? { ...c, score: data.score } : c
      )
    );
    setCommentVotes(prev => ({ ...prev, [commentId]: newVote === 0 ? null : newVote as Vote }));
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
          <button 
            onClick={() => votePost(1)}
            className={` ${
              postVote === 1 ? 'text-red-500 hover:text-red-700' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <ChevronUp />
          </button>
          <span>{post.score ?? 0}</span>
          <button 
            onClick={() => votePost(-1)}
            className={` ${
              postVote === -1 ? 'text-blue-500 hover:text-blue-700' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <ChevronDown />
          </button>
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
                <button 
                  onClick={() => voteComment(c.comment_id, 1)}
                  className={`hover:text-gray-700 ${
                    commentVotes[c.comment_id] === 1 ? 'text-red-500' : 'text-gray-500'
                  }`}
                >
                  <ChevronUp />
                </button>
                <span>{c.score ?? 0}</span>
                <button 
                  onClick={() => voteComment(c.comment_id, -1)}
                  className={`hover:text-gray-700 ${
                    commentVotes[c.comment_id] === -1 ? 'text-blue-500' : 'text-gray-500'
                  }`}
                >
                  <ChevronDown />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
