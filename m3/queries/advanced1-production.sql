-- Advanced Feature 1: Subreddit Recommendation System using CTEs
-- Recommends subreddits to user_01 based on similar users' voting patterns
WITH my_upvoted_posts AS (
  SELECT post_id
  FROM votes
  WHERE user_id = 'c4f42565-9ef8-44df-8d00-20149da7e72c'
    AND vote_type = 1
),
similar_users AS (
  SELECT DISTINCT v.user_id
  FROM votes v
    JOIN my_upvoted_posts mup ON mup.post_id = v.post_id
  WHERE v.vote_type = 1
    AND NOT (
      v.user_id = 'c4f42565-9ef8-44df-8d00-20149da7e72c'
    )
),
their_subreddits AS (
  SELECT sm.subreddit_id,
    COUNT(*) AS similar_member_count
  FROM subreddit_membership sm
    JOIN similar_users su ON su.user_id = sm.user_id
  GROUP BY sm.subreddit_id
),
my_subreddits AS (
  SELECT subreddit_id
  FROM subreddit_membership
  WHERE user_id = 'c4f42565-9ef8-44df-8d00-20149da7e72c'
),
candidate_ids AS (
  SELECT subreddit_id
  FROM their_subreddits
  EXCEPT
  SELECT subreddit_id
  FROM my_subreddits
)
SELECT s.subreddit_id,
  s.subreddit_name,
  ts.similar_member_count
FROM candidate_ids c
  JOIN their_subreddits ts USING (subreddit_id)
  JOIN subreddits s USING (subreddit_id)
ORDER BY ts.similar_member_count DESC,
  s.subreddit_name
LIMIT 20;