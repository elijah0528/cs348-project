import { Subreddit } from '@/components/types';

export async function getSubreddits(): Promise<Subreddit[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/reddit/subreddits`, { 
      cache: 'no-store' 
    });
    const data = await res.json();
    return data.subreddits || [];
  } catch (error) {
    console.error('Failed to fetch subreddits:', error);
    return [];
  }
}

export async function getUserMembership(userId: string): Promise<string[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/reddit/membership/${userId}`, { 
      cache: 'no-store' 
    });
    const data = await res.json();
    return data.subredditIds || [];
  } catch (error) {
    console.error('Failed to fetch user membership:', error);
    return [];
  }
}
