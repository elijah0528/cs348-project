-- Create a post
INSERT INTO posts (title, content, subreddit_id, user_id)
VALUES ($1, $2, $3, $4)
RETURNING post_id;

-- Fetch a single post with aggregated score
WITH voted AS (
  SELECT p.post_id,
         p.title,
         p.content,
         p.created_at,
         pr.username,
         SUM(v.vote_type) AS score
  FROM posts p
  JOIN votes v ON v.post_id = p.post_id
  JOIN profiles pr ON pr.user_id = p.user_id
  WHERE p.post_id = $1
  GROUP BY p.post_id, pr.username
),
novote AS (
  SELECT p.post_id,
         p.title,
         p.content,
         p.created_at,
         pr.username,
         0 AS score
  FROM posts p
  JOIN profiles pr ON pr.user_id = p.user_id
  WHERE p.post_id = $1
    AND NOT EXISTS (SELECT 1 FROM votes v WHERE v.post_id = p.post_id)
)
SELECT * FROM voted
UNION ALL
SELECT * FROM novote;

-- Fetch comments for a post with aggregated score
WITH voted_c AS (
  SELECT c.comment_id,
         c.content,
         c.created_at,
         pr.username,
         SUM(vc.vote_type) AS score
  FROM comments c
  JOIN votes_comments vc ON vc.comment_id = c.comment_id
  JOIN profiles pr ON pr.user_id = c.user_id
  WHERE c.post_id = $1
  GROUP BY c.comment_id, pr.username
),
novote_c AS (
  SELECT c.comment_id,
         c.content,
         c.created_at,
         pr.username,
         0 AS score
  FROM comments c
  JOIN profiles pr ON pr.user_id = c.user_id
  WHERE c.post_id = $1
    AND NOT EXISTS (SELECT 1 FROM votes_comments vc WHERE vc.comment_id = c.comment_id)
)
SELECT * FROM voted_c
UNION ALL
SELECT * FROM novote_c
ORDER BY created_at ASC; 