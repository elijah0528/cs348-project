CREATE TABLE profiles (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    pw_hash TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE subreddits (
    subreddit_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subreddit_name TEXT NOT NULL UNIQUE,
    admin_id UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE posts (
    post_id UUID PRIMARY KEY DEFAULT gen_random_uuid(), 
    user_id UUID REFERENCES profiles(user_id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    subreddit_id UUID REFERENCES subreddits(subreddit_id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE comments (
    comment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content TEXT NOT NULL,
    post_id UUID REFERENCES posts(post_id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(user_id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE subreddit_membership (
    user_id UUID REFERENCES profiles(user_id) ON DELETE CASCADE,
    subreddit_id UUID REFERENCES subreddits(subreddit_id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, subreddit_id)
);

CREATE TABLE votes (
    user_id UUID REFERENCES profiles(user_id) ON DELETE CASCADE,
    post_id UUID REFERENCES posts(post_id) ON DELETE CASCADE,
    vote_type INTEGER NOT NULL CHECK (vote_type IN (-1, 1)),
    PRIMARY KEY (user_id, post_id)
);

CREATE TABLE votes_comments (
    user_id UUID REFERENCES profiles(user_id) ON DELETE CASCADE,
    comment_id UUID REFERENCES comments(comment_id) ON DELETE CASCADE,
    vote_type INTEGER NOT NULL CHECK (vote_type IN (-1, 1)),
    PRIMARY KEY (user_id, comment_id)
);
