-- Fetch user profile
SELECT user_id,
       username,
       email
FROM profiles
WHERE user_id = $1;

-- Fetch posts made by a user
SELECT p.post_id,
       p.title,
       p.content,
       p.created_at,
       s.subreddit_name
FROM posts p
JOIN subreddits s ON p.subreddit_id = s.subreddit_id
WHERE p.user_id = $1
ORDER BY p.created_at DESC;

-- Fetch comments made by a user
SELECT c.comment_id,
       c.content,
       c.created_at,
       p.post_id,
       p.title AS post_title,
       s.subreddit_name
FROM comments c
JOIN posts p ON c.post_id = p.post_id
JOIN subreddits s ON p.subreddit_id = s.subreddit_id
WHERE c.user_id = $1
ORDER BY c.created_at DESC; 