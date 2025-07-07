import Link from "next/link";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Post } from "@/components/types";

type Vote = -1 | 1;

interface PostCardProps {
  post: Post;
  currentVote: Vote | null;
  onVote?: (postId: string, vote: Vote) => void;
  showVoting?: boolean;
}

export default function PostCard({ 
  post, 
  currentVote, 
  onVote, 
  showVoting = true 
}: PostCardProps) {

  const maxContentLength: number = 400;
  
  return (
    <Link href={`/post/${post.post_id}`} className="block">
      <div className="border rounded-lg p-4 mb-4 max-h-48 hover:bg-accent animate-ease-in-out duration-100">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <div
              className="text-xl mb-2 font-semibold"
            >
              {post.title}
            </div>
            <span className="text-sm text-muted-foreground">
              <Link href={`/user/${post.username}`} className="hover:underline">
                u/{post.username}
              </Link>
            </span>
            <p className="mt-4 mb-2 line-clamp-3 text-sm">
              {post.content.length > maxContentLength ? `${post.content.slice(0, maxContentLength)}...` : post.content}
            </p>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center text-sm text-stone-600 space-x-4">
              <span>{post.comments_count ?? 0} comments</span>
              {showVoting && onVote && (
                <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      onVote(post.post_id, 1);
                    }} 
                    className={`${
                      currentVote === 1 ? 'text-red-500 hover:text-red-700' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <ChevronUp />
                  </button>
                  <span>{post.score ?? 0}</span>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      onVote(post.post_id, -1);
                    }}
                    className={`${
                      currentVote === -1 ? 'text-blue-500 hover:text-blue-700' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <ChevronDown />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}