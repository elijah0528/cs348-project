-- for testing purposes (before)
SELECT * FROM profiles;

-- logic
INSERT INTO profiles (user_id, username, email, pw_hash)
VALUES ('00000000-0000-0000-0000-000000000007', 'Rajan Agarwal', 'rajan.agarwal@uwaterloo.ca', 'newpass');

-- also for testing purposes (after)
SELECT * FROM profiles;