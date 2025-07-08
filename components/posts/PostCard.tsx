import Link from "next/link";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Post } from "@/components/types";

type Vote = -1 | 1;
const MAX_CONTENT_LENGTH = 400;

export default function PostCard({
  post,
  handleVote,
}: {
  post: Post;
  handleVote: (postId: string, vote: Vote) => void;
}) {
  const content =
    post.content.length > MAX_CONTENT_LENGTH
      ? post.content.slice(0, MAX_CONTENT_LENGTH) + "..."
      : post.content;

  return (
    <Link
      key={post.post_id}
      href={`/post/${post.post_id}`}
      className="border p-3 rounded-md w-full"
    >
      <div className="text-lg font-semibold">{post.title}</div>
      <p className="mb-2">{content}</p>
      <p className="text-xs text-stone-600">
        r/{post.subreddit_name} • u/{post.username}
      </p>
      <div className="flex items-center mt-2 space-x-2 text-sm">
        <button 
          onClick={(e) => {
            e.preventDefault();
            handleVote(post.post_id, 1);
          }} 
          className="p-1 rounded hover:bg-gray-100 transition-colors text-gray-500 hover:text-orange-500"
        >
          <ChevronUp size={16} />
        </button>
        <span className="font-medium text-gray-700">{post.score ?? 0}</span>
        <button 
          onClick={(e) => {
            e.preventDefault();
            handleVote(post.post_id, -1);
          }} 
          className="p-1 rounded hover:bg-gray-100 transition-colors text-gray-500 hover:text-blue-500"
        >
          <ChevronDown size={16} />
        </button>
      </div>
    </Link>
  );
}
