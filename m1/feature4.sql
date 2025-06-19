-- for testing purposes (before)
SELECT * FROM posts;

UPDATE posts
SET content = 'This is my updated content for my post'
WHERE post_id = '00000000-0000-0000-0000-200000000001'
AND user_id = '00000000-0000-0000-0000-000000000001';

-- also for testing purposes (after)
SELECT * FROM posts;