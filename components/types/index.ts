export type User = {
  user_id: string;
  username: string;
  email: string;
};

export type Subreddit = {
  subreddit_id: string;
  subreddit_name: string;
  username: string;
};

export type Post = {
  post_id: string;
  title: string;
  content: string;
  created_at: string;
  username: string;
  subreddit_name?: string;
  subreddit_id?: string;
  score?: number;
  comments_count?: number;
};

export type Comment = {
  comment_id: string;
  content: string;
  created_at: string;
  post_id: string;
  post_title: string;
  subreddit_name: string;
  username?: string;
  score?: number;
}; 