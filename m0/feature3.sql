WITH all_posts AS (
  SELECT p.post_id, p.user_id, p.title, p.content, SUM(v.vote_type) AS vote_score
  FROM posts p
  JOIN votes v ON v.post_id = p.post_id
  WHERE p.subreddit_id = '00000000-0000-0000-0000-100000000000'
  GROUP BY p.post_id, p.user_id,  p.title, p.content

  UNION ALL

  SELECT p.post_id, p.user_id, p.title, p.content, 0 AS vote_score
  FROM posts p
  WHERE p.subreddit_id = '00000000-0000-0000-0000-100000000000'
    AND NOT EXISTS (
      SELECT 1 FROM votes v WHERE v.post_id = p.post_id
    )
)
SELECT user_id, title, content, vote_score
FROM all_posts
ORDER BY vote_score DESC;
