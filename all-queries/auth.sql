-- User login
SELECT user_id,
       username,
       email
FROM profiles
WHERE username = $1
  AND pw_hash = $2;

-- Register new user
INSERT INTO profiles (username, email, pw_hash)
VALUES ($1, $2, $3);

-- Delete a user
DELETE FROM profiles
WHERE user_id = $1; 