WITH all_posts AS (
         SELECT p.post_id, p.user_id, p.title, p.content, p.created_at, s.subreddit_name, pr.username, SUM(v.vote_type) AS vote_score
         FROM posts p
         JOIN subreddits s ON s.subreddit_id = p.subreddit_id
         JOIN profiles pr ON pr.user_id = p.user_id
         JOIN votes v ON v.post_id = p.post_id
         WHERE p.subreddit_id = '00000000-0000-0000-0000-100000000000'
         GROUP BY p.post_id, p.user_id, p.title, p.content, p.created_at, s.subreddit_name, pr.username

         UNION ALL

         SELECT p.post_id, p.user_id, p.title, p.content, p.created_at, s.subreddit_name, pr.username, 0 AS vote_score
         FROM posts p
         JOIN subreddits s ON s.subreddit_id = p.subreddit_id
         JOIN profiles pr ON pr.user_id = p.user_id
         WHERE p.subreddit_id = '00000000-0000-0000-0000-100000000000'
           AND NOT EXISTS (
             SELECT 1 FROM votes v WHERE v.post_id = p.post_id
           )
       )
SELECT *
FROM all_posts
