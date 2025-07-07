-- Fetch subreddit memberships for a user
SELECT subreddit_id
FROM subreddit_membership
WHERE user_id = $1;

-- Join a subreddit
INSERT INTO subreddit_membership (user_id, subreddit_id)
VALUES ($1, $2);

-- Leave a subreddit
DELETE FROM subreddit_membership
WHERE user_id = $1
  AND subreddit_id = $2; 