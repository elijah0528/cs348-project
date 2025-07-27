-- Advanced Feature 5: Rate Limiting Trigger
-- Demonstrates 30-second rate limit enforcement between posts by same user
-- First post should succeed
INSERT INTO posts (
    post_id,
    user_id,
    title,
    content,
    subreddit_id,
    created_at
  )
VALUES (
    '00000000-0000-0000-0000-300000000001',
    '00000000-0000-0000-0000-000000000001',
    'First Post - Should Work',
    'This post should insert successfully.',
    '00000000-0000-0000-0000-100000000000',
    NOW()
  );
-- Second post immediately after should fail with "Rate limit exceeded"
INSERT INTO posts (
    post_id,
    user_id,
    title,
    content,
    subreddit_id,
    created_at
  )
VALUES (
    '00000000-0000-0000-0000-300000000002',
    '00000000-0000-0000-0000-000000000001',
    'Second Post - Should Fail',
    'This post should be blocked by rate limiting.',
    '00000000-0000-0000-0000-100000000000',
    NOW()
  );