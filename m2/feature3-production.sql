WITH all_posts AS (
         SELECT p.post_id, p.user_id, p.title, p.content, p.created_at, s.subreddit_name, pr.username, SUM(v.vote_type) AS vote_score
         FROM posts p
         JOIN subreddits s ON s.subreddit_id = p.subreddit_id
         JOIN profiles pr ON pr.user_id = p.user_id
         JOIN votes v ON v.post_id = p.post_id
         WHERE p.subreddit_id = 'f1f43ddc-28ba-4cce-ad01-478f226e40d2'
         GROUP BY p.post_id, p.user_id, p.title, p.content, p.created_at, s.subreddit_name, pr.username

         UNION ALL

         SELECT p.post_id, p.user_id, p.title, p.content, p.created_at, s.subreddit_name, pr.username, 0 AS vote_score
         FROM posts p
         JOIN subreddits s ON s.subreddit_id = p.subreddit_id
         JOIN profiles pr ON pr.user_id = p.user_id
         WHERE p.subreddit_id = 'f1f43ddc-28ba-4cce-ad01-478f226e40d2'
           AND NOT EXISTS (
             SELECT 1 FROM votes v WHERE v.post_id = p.post_id
           )
       )
SELECT user_id, title, content, vote_score
FROM all_posts
ORDER BY vote_score DESC, created_at DESC;
