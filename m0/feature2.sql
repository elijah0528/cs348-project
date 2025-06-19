-- for testing purposes (before)
SELECT * FROM profiles;

-- logic
DELETE FROM profiles
WHERE user_id = '00000000-0000-0000-0000-000000000007';

-- also for testing purposes (after)
SELECT * FROM profiles;