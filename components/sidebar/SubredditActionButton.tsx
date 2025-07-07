"use client";

import { useState } from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useRouter } from 'next/navigation';

interface SubredditActionButtonProps {
  subredditId: string;
  userId: string;
  isOwner: boolean;
  isMember: boolean;
}

export default function SubredditActionButton({
  subredditId,
  userId,
  isOwner,
  isMember,
}: SubredditActionButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleAction = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isOwner) {
        // Delete subreddit
        await fetch(`/api/reddit/subreddits/${subredditId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: userId,
          }),
        });
      } else if (isMember) {
        // Leave subreddit
        await fetch(`/api/reddit/subreddits/${subredditId}/leave`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: userId,
          }),
        });
      } else {
        // Join subreddit
        await fetch(`/api/reddit/subreddits/${subredditId}/join`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: userId,
          }),
        });
      }

      // Refresh the page to update the sidebar
      router.refresh();
    } catch (error) {
      console.error('Action failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getIcon = () => {
    if (isOwner) return <Trash2 className="size-3.5" />;
    if (isMember) return <Minus className="size-3.5" />;
    return <Plus className="size-3.5" />;
  };

  const getTooltipText = () => {
    if (isOwner) return 'Delete Subreddit';
    if (isMember) return 'Leave Subreddit';
    return 'Join Subreddit';
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={handleAction}
          disabled={isLoading}
          className="flex cursor-pointer items-center justify-center size-6 rounded-md hover:bg-stone-300/50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {getIcon()}
        </button>
      </TooltipTrigger>
      <TooltipContent side="right" sideOffset={6}>
        {getTooltipText()}
      </TooltipContent>
    </Tooltip>
  );
}
