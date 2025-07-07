-- Get all subreddits with their creator
SELECT s.subreddit_id,
       s.subreddit_name,
       p.username
FROM subreddits s
JOIN profiles p ON s.admin_id = p.user_id;

-- Create a new subreddit
INSERT INTO subreddits (subreddit_name, admin_id)
VALUES ($1, $2)
RETURNING subreddit_id, subreddit_name;

-- Delete a subreddit (admin only)
DELETE FROM subreddits
WHERE subreddit_id = $1
  AND admin_id = $2;

-- Fetch subreddit with posts, vote score & comment counts
SELECT s.subreddit_id,
       s.subreddit_name,
       admin.username  AS admin_username,
       p.post_id,
       p.title,
       p.content,
       p.created_at,
       author.username,
       SUM(v.vote_type)    AS score,
       COUNT(c.comment_id) AS comments_count
FROM subreddits s
LEFT JOIN profiles admin  ON admin.user_id = s.admin_id
LEFT JOIN posts    p      ON p.subreddit_id = s.subreddit_id
LEFT JOIN profiles author ON author.user_id = p.user_id
LEFT JOIN votes     v     ON v.post_id = p.post_id
LEFT JOIN comments  c     ON c.post_id = p.post_id
WHERE s.subreddit_id = $1
GROUP BY s.subreddit_id,
         s.subreddit_name,
         admin.username,
         p.post_id,
         author.username
ORDER BY p.created_at DESC;

-- Fallback: fetch subreddit meta when no posts exist
SELECT s.subreddit_id,
       s.subreddit_name,
       p.username AS admin_username
FROM subreddits s
JOIN profiles p ON s.admin_id = p.user_id
WHERE s.subreddit_id = $1; 