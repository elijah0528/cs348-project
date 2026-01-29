-- Advanced Feature 7: User Karma Breakdown by Subreddit
-- Given a user_id ($1), computes post/comment counts and vote-derived karma per subreddit.
WITH post_karma AS (
  SELECT p.subreddit_id,
    COUNT(DISTINCT p.post_id) AS post_count,
    COALESCE(SUM(v.vote_type), 0) AS post_karma
  FROM posts p
    LEFT JOIN votes v ON v.post_id = p.post_id
  WHERE p.user_id = $1
  GROUP BY p.subreddit_id
),
comment_karma AS (
  SELECT p.subreddit_id,
    COUNT(DISTINCT c.comment_id) AS comment_count,
    COALESCE(SUM(vc.vote_type), 0) AS comment_karma
  FROM comments c
    JOIN posts p ON p.post_id = c.post_id
    LEFT JOIN votes_comments vc ON vc.comment_id = c.comment_id
  WHERE c.user_id = $1
  GROUP BY p.subreddit_id
),
combined AS (
  SELECT COALESCE(pk.subreddit_id, ck.subreddit_id) AS subreddit_id,
    COALESCE(pk.post_count, 0) AS post_count,
    COALESCE(ck.comment_count, 0) AS comment_count,
    COALESCE(pk.post_karma, 0) AS post_karma,
    COALESCE(ck.comment_karma, 0) AS comment_karma
  FROM post_karma pk
    FULL OUTER JOIN comment_karma ck ON ck.subreddit_id = pk.subreddit_id
),
with_names AS (
  SELECT c.*,
    s.subreddit_name,
    (c.post_karma + c.comment_karma) AS total_karma,
    (c.post_count + c.comment_count) AS total_contributions
  FROM combined c
    JOIN subreddits s ON s.subreddit_id = c.subreddit_id
)
SELECT subreddit_id,
  subreddit_name,
  post_count,
  comment_count,
  post_karma,
  comment_karma,
  total_contributions,
  total_karma,
  ROUND(
    100.0 * total_karma / NULLIF(SUM(total_karma) OVER (), 0),
    2
  ) AS pct_of_user_karma,
  DENSE_RANK() OVER (
    ORDER BY total_karma DESC,
      total_contributions DESC,
      subreddit_name
  ) AS karma_rank
FROM with_names
ORDER BY karma_rank,
  subreddit_name
LIMIT 20;
