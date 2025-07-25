CREATE INDEX IF NOT EXISTS index_posts_user_id ON posts (user_id);
CREATE INDEX IF NOT EXISTS index_comments_user_id ON comments (user_id);
CREATE INDEX IF NOT EXISTS index_subreddit_user_id ON subreddit_membership (user_id);
CREATE INDEX IF NOT EXISTS index_votes_user_id ON votes (user_id);
CREATE INDEX IF NOT EXISTS index_votes_comments_user_id ON votes_comments (user_id);
CREATE INDEX IF NOT EXISTS index_subreddits_admin_id ON subreddits (admin_id);
CREATE INDEX IF NOT EXISTS index_posts_subreddit_id ON posts (subreddit_id);
CREATE INDEX IF NOT EXISTS index_posts_subreddit_created_at_desc ON posts (subreddit_id, created_at DESC);
CREATE INDEX IF NOT EXISTS index_votes_post_id_vote_type ON votes (post_id, vote_type);
CREATE INDEX IF NOT EXISTS index_profiles_user_id ON profiles (user_id);
CREATE INDEX IF NOT EXISTS index_posts_created_at_desc ON posts (created_at DESC);

CREATE INDEX IF NOT EXISTS index_subreddit_membership_user_sub ON subreddit_membership (user_id, subreddit_id);
CREATE INDEX IF NOT EXISTS index_votes_user_upvotes ON votes (user_id, post_id) WHERE vote_type = 1;
CREATE INDEX IF NOT EXISTS index_votes_post_upvotes ON votes (post_id, user_id) WHERE vote_type = 1;