INSERT INTO profiles (user_id, name, email, pw_hash) VALUES
    ('Ian', 'ikorovin@uwaterloo.ca', 'pass'),
    ('Elijah', 'ekurien@uwaterloo.ca', 'word'),
    ('Elijah', 'ekuren@uwaterloo.ca', 'word'),
    ('Rajan', 'r2agarwal@uwaterloo.ca', 'foo'),
    ('Ishaan', 'i2dey@uwaterloo.ca', 'bar');

INSERT INTO subreddits (subreddit_id, subreddit_name, user_id) VALUES
    ('uwaterloo', (SELECT user_id FROM profiles WHERE name = 'ikorovin@uwaterloo.ca')),
    ('cs', (SELECT user_id FROM profiles WHERE name = 'ekurien@uwaterloo.ca')),
    ('music', (SELECT user_id FROM profiles WHERE name = 'r2agarwal@uwaterloo.ca')),
    ('coffee', (SELECT user_id FROM profiles WHERE name = 'i2dey@uwaterloo.ca'));
