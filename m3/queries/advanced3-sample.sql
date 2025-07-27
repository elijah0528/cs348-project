-- Advanced Feature 3: Trending Posts Algorithm using CTEs and Mathematical Functions
-- Calculates trending scores for posts visible to user 'Ian'
WITH all_posts AS (
  SELECT p.post_id,
    p.user_id,
    p.title,
    p.content,
    p.created_at,
    s.subreddit_name,
    pr.username,
    COALESCE(SUM(v.vote_type), 0) AS vote_score,
    EXTRACT(
      EPOCH
      FROM NOW() - p.created_at
    ) / 86400 AS age_days
  FROM posts p
    JOIN subreddits s ON s.subreddit_id = p.subreddit_id
    JOIN profiles pr ON pr.user_id = p.user_id
    JOIN votes v ON v.post_id = p.post_id
  WHERE (
      p.subreddit_id IN (
        SELECT subreddit_id
        FROM subreddit_membership
        WHERE user_id = '00000000-0000-0000-0000-000000000001'
      )
      OR p.subreddit_id IN (
        SELECT subreddit_id
        FROM subreddits
        WHERE admin_id = '00000000-0000-0000-0000-000000000001'
      )
    )
  GROUP BY p.post_id,
    p.user_id,
    p.title,
    p.content,
    p.created_at,
    s.subreddit_name,
    pr.username
)
SELECT *,
  vote_score / POWER(age_days + 0.5, 1.5) AS trending_score
FROM all_posts
ORDER BY trending_score DESC;