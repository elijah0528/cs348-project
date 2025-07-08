-- for testing purposes (before)
SELECT * FROM profiles;

-- logic
DELETE FROM profiles
WHERE user_id = '4f40832e-41e9-4a23-aec6-dcad8f948399';

-- also for testing purposes (after)
SELECT * FROM profiles;