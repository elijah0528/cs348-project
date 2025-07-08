-- for testing purposes (before)
-- last 10 profiles
SELECT * FROM profiles ORDER BY created_at DESC LIMIT 10;

-- logic
INSERT INTO profiles (username, email, pw_hash)
VALUES ('Rajan Agarwal', 'rajan.agarwal@uwaterloo.ca', 'newpass');

-- also for testing purposes (after)
SELECT * FROM profiles ORDER BY created_at DESC LIMIT 10;
