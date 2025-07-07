"use client";

import { useRouter } from 'next/navigation';
import CreateSubreddit from '@/components/subreddits/CreateSubreddit';

interface CreateSubredditWrapperProps {
  userId: string;
}

export default function CreateSubredditWrapper({ userId }: CreateSubredditWrapperProps) {
  const router = useRouter();

  const handleSuccess = () => {
    // Refresh the page to update server-rendered sidebar data
    router.refresh();
  };

  return (
    <CreateSubreddit
      userId={userId}
      onSuccess={handleSuccess}
    />
  );
}
