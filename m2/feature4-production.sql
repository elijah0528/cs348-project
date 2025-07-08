-- for testing purposes (before)
SELECT * FROM posts WHERE user_id = 'aa774655-ce37-4a4e-83a1-00dda856ce96';

UPDATE posts
SET content = 'This is my updated content for my post'
WHERE post_id = '4dd980bb-feab-48cc-975e-8af7a0962e3e'
AND user_id = 'aa774655-ce37-4a4e-83a1-00dda856ce96';

-- also for testing purposes (after)
SELECT * FROM posts WHERE user_id = 'aa774655-ce37-4a4e-83a1-00dda856ce96';
