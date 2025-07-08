-- for testing purposes (before)
SELECT * FROM profiles;

-- logic
DELETE FROM profiles
WHERE user_id = '9c9505d3-3358-4757-9892-be8ea3f5477a';

-- also for testing purposes (after)
SELECT * FROM profiles;