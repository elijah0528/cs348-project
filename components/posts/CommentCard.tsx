import Link from "next/link";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Comment } from "@/components/types";

const MAX_CONTENT_LENGTH = 400;

type Vote = -1 | 1;

export default function CommentCard({
  comment,
  user,
  commentVote,
  onVote,
}: {
  comment: Comment;
  user?: { user_id: string } | null;
  commentVote?: Vote | null;
  onVote?: (commentId: string, vote: Vote) => void;
}) {
  const content =
    comment.content.length > MAX_CONTENT_LENGTH
      ? comment.content.slice(0, MAX_CONTENT_LENGTH) + "..."
      : comment.content;

  return (
    <div className="border p-3 rounded-md w-full">
      <div className="text-xs text-stone-600 mb-2">
        {comment.subreddit_name && `r/${comment.subreddit_name}`}
        {comment.subreddit_name && " • "}
        <Link
          href={`/post/${comment.post_id}`}
          className="font-semibold hover:underline"
        >
          {comment.post_title || "Comment"}
        </Link>
        {" • "}
        {comment.username && `u/${comment.username} • `}
        {new Date(comment.created_at).toLocaleString()}
      </div>
      <p className="text-sm mb-2">{content}</p>
      <div className="flex items-center space-x-2 text-sm text-stone-600">
        {user && onVote ? (
          <>
            <button
              onClick={() => onVote(comment.comment_id, 1)}
              className={`p-1 rounded hover:bg-gray-100 transition-colors ${
                commentVote === 1 ? "text-orange-500" : "text-gray-500"
              }`}
            >
              <ChevronUp size={16} />
            </button>
            <span className="font-medium">{comment.score ?? 0}</span>
            <button
              onClick={() => onVote(comment.comment_id, -1)}
              className={`p-1 rounded hover:bg-gray-100 transition-colors ${
                commentVote === -1 ? "text-blue-500" : "text-gray-500"
              }`}
            >
              <ChevronDown size={16} />
            </button>
          </>
        ) : (
          <span>{comment.score ?? 0} points</span>
        )}
      </div>
    </div>
  );
}
