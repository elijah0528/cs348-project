-- Create a comment on a post
INSERT INTO comments (content, post_id, user_id)
VALUES ($1, $2, $3); 