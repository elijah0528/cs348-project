CREATE TABLE profiles (
    user_id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    pw_hash TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE subreddits (
    subreddit_id UUID PRIMARY KEY,
    subreddit_name TEXT NOT NULL UNIQUE,
    user_id UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE posts (
    post_id UUID PRIMARY KEY, 
    user_id UUID REFERENCES profiles(user_id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    subreddit_id UUID REFERENCES subreddits(subreddit_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE comments (
    comment_id UUID PRIMARY KEY,
    content TEXT NOT NULL,
    post_id UUID REFERENCES posts(post_id) ON DELETE CASCADE,
    subreddit_id UUID REFERENCES subreddits(subreddit_id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(user_id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE subreddit_membership (
    user_id UUID REFERENCES profiles(user_id) ON DELETE CASCADE,
    subreddit_id UUID REFERENCES subreddits(subreddit_id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, subreddit_id)
);

CREATE TABLE votes (
    vote_id UUID PRIMARY KEY,
    user_id UUID REFERENCES profiles(user_id) ON DELETE CASCADE,
    post_id UUID REFERENCES posts(post_id) ON DELETE CASCADE,
    vote_type INTEGER NOT NULL CHECK (vote_type IN (-1, 1))
);

CREATE TABLE votes_comments (
    vote_id UUID PRIMARY KEY,
    user_id UUID REFERENCES profiles(user_id) ON DELETE CASCADE,
    comment_id UUID REFERENCES comments(comment_id) ON DELETE CASCADE,
    vote_type INTEGER NOT NULL CHECK (vote_type IN (-1, 1))
);
