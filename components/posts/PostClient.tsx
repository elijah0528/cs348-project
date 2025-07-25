"use client";

import { useState, useLayoutEffect, useRef, useEffect } from "react";
import { Comment, Post, User } from "@/components/types";
import CreateComment from "@/components/comments/CreateComment";
import CommentCard from "@/components/posts/CommentCard";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

type Vote = -1 | 1;

interface PostClientProps {
  post: Post;
  initialComments: Comment[];
  user: User | null;
}

export default function PostClient({
  post,
  initialComments,
  user,
}: PostClientProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [isMember, setIsMember] = useState<boolean>(false);
  const [postVote, setPostVote] = useState<Vote | null>(
    (post as any).my_vote && (post as any).my_vote !== 0 ? (post as any).my_vote as Vote : null
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);
  const [commentVotes, setCommentVotes] = useState<Record<string, Vote | null>>(()=>{
    const votes: Record<string, Vote | null> = {};
    initialComments.forEach((c: any)=>{
      if (typeof c.my_vote === "number" && c.my_vote !== 0) {
        votes[c.comment_id] = c.my_vote as Vote;
      }
    });
    return votes;
  });
  const [currentPost, setCurrentPost] = useState<Post>(post);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Determine if user is a member of the post's subreddit
  useEffect(() => {
    const checkMembership = async () => {
      if (!user) {
        setIsMember(false);
        return;
      }
      try {
        const res = await fetch(`/api/reddit/subreddits/${post.subreddit_id}/membership?user_id=${user.user_id}`);
        const data = await res.json();
        setIsMember(!!data.isMember);
      } catch (err) {
        console.error("Membership check failed", err);
        setIsMember(false);
      }
    };
    checkMembership();
  }, [post.subreddit_id, user]);

  useLayoutEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [isEditing, editedContent]);

  const votePost = async (vote: Vote) => {
    if (!user) return;

    const currentVote = postVote;
    const newVote = currentVote === vote ? 0 : vote;

    const res = await fetch(`/api/reddit/posts/${post.post_id}/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: user.user_id, vote_type: newVote }),
    });
    const data = await res.json();
    setCurrentPost({ ...currentPost, score: data.score });
    setPostVote(newVote === 0 ? null : (newVote as Vote));
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
    setCommentVotes((prev) => ({
      ...prev,
      [commentId]: newVote === 0 ? null : (newVote as Vote),
    }));
  };

  const savePost = async () => {
    if (!user) return;

    const res = await fetch(`/api/reddit/posts/${post.post_id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: editedContent }),
    });

    if (res.ok) {
      setCurrentPost({ ...currentPost, content: editedContent });
      setIsEditing(false);
    }
  };

  const refreshPost = async () => {
    const res = await fetch(`/api/reddit/posts/${post.post_id}`);
    if (res.ok) {
      const data = await res.json();
      setComments(data.comments || []);
      if (data.post) setCurrentPost(data.post);
    }
  };

  return (
    <div className="p-6 overflow-y-auto max-w-2xl mx-auto">
      <h1 className="text-2xl mb-2">{currentPost.title}</h1>
      <div className="mb-4">
        {isEditing ? (
          <textarea
            ref={textareaRef}
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full border-2 p-2 rounded-md resize-none overflow-hidden"
            rows={1}
          />
        ) : (
          <p className="p-2">{currentPost.content}</p>
        )}
      </div>
      <div className="flex items-center justify-between text-sm text-stone-600 mb-6">
        <span>Posted by {currentPost.username}</span>
        {user && (
          <div className="flex items-center space-x-2">
            {user.username === currentPost.username && <div>
              {isEditing && user.username === currentPost.username ? (
                <div className="flex items-center space-x-2">     
                  <Button variant="destructive" className="bg-red-500" onClick={() => {
                    setIsEditing(false);
                    setEditedContent(currentPost.content);
                  }}>
                    Cancel
                  </Button>
                  <Button variant="link" onClick={savePost}>
                    Save
                  </Button>
                </div>
              ) : (
                <Button variant="link" onClick={() => setIsEditing(true)}>
                  Edit
                </Button>
              )}
            </div>
            }
            <button
              onClick={() => votePost(1)}
              className={`p-2 rounded hover:bg-gray-100 transition-colors ${
                postVote === 1 ? "text-orange-500 bg-orange-50" : "text-gray-500"
              }`}
            >
              <ChevronUp size={20} />
            </button>
            <span className="font-medium text-gray-700 min-w-[2rem] text-center">{currentPost.score ?? 0}</span>
            <button
              onClick={() => votePost(-1)}
              className={`p-2 rounded hover:bg-gray-100 transition-colors ${
                postVote === -1 ? "text-blue-500 bg-blue-50" : "text-gray-500"
              }`}
            >
              <ChevronDown size={20} />
            </button>
          </div>
        )}
      </div>

      <h2 className="text-xl mb-4">Comments</h2>
      {user && isMember && (
        <CreateComment
          postId={currentPost.post_id}
          userId={user.user_id}
          onSuccess={refreshPost}
        />
      )}
      <div className="mt-6 space-y-3">
        {comments.length === 0 ? (
          <p className="text-gray-500 italic">No comments yet.</p>
        ) : (
          comments.map((c) => (
            <CommentCard
              key={c.comment_id}
              comment={c}
              user={user}
              commentVote={commentVotes[c.comment_id]}
              onVote={voteComment}
            />
          ))
        )}
      </div>
    </div>
  );
}
