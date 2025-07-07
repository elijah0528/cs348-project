-- Remove an existing vote on a post
DELETE FROM votes
WHERE user_id = $1
  AND post_id = $2;

-- Add / update a vote on a post
INSERT INTO votes (user_id, post_id, vote_type)
VALUES ($1, $2, $3);

-- Recalculate post score
SELECT SUM(vote_type) AS score
FROM votes
WHERE post_id = $1;

-- Remove an existing vote on a comment
DELETE FROM votes_comments
WHERE user_id = $1
  AND comment_id = $2;

-- Add / update a vote on a comment
INSERT INTO votes_comments (user_id, comment_id, vote_type)
VALUES ($1, $2, $3);

-- Recalculate comment score
SELECT SUM(vote_type) AS score
FROM votes_comments
WHERE comment_id = $1; 