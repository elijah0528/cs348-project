-- for testing purposes (before)
SELECT * FROM profiles ORDER BY created_at DESC LIMIT 10;

-- logic
DELETE FROM profiles
WHERE user_id = '4fcdf7a0-26cb-4b08-b9b8-4b2e9fad6f13';

-- also for testing purposes (after)
SELECT * FROM profiles ORDER BY created_at DESC LIMIT 10;