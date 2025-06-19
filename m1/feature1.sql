-- for testing purposes (before)
SELECT * FROM profiles;

-- logic
INSERT INTO profiles (username, email, pw_hash)
VALUES ('Rajan Agarwal', 'rajan.agarwal@uwaterloo.ca', 'newpass');

-- also for testing purposes (after)
SELECT * FROM profiles;