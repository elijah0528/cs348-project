-- get all posts for a user
SELECT p.post_id, p.title, p.content, p.created_at, pr.username, s.subreddit_name, s.subreddit_id, SUM(v.vote_type) AS score
FROM posts p
LEFT OUTER JOIN votes v ON v.post_id = p.post_id
JOIN subreddits s ON p.subreddit_id = s.subreddit_id
JOIN profiles pr ON pr.user_id = p.user_id
WHERE (
  p.subreddit_id IN (SELECT subreddit_id FROM subreddit_membership WHERE user_id = 'c4f42565-9ef8-44df-8d00-20149da7e72c')
  OR p.subreddit_id IN (SELECT subreddit_id FROM subreddits WHERE admin_id = 'c4f42565-9ef8-44df-8d00-20149da7e72c')
)
GROUP BY p.post_id, pr.username, s.subreddit_name, s.subreddit_id
ORDER BY p.created_at DESC
LIMIT 100;
