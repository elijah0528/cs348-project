import uuid
import random
from pathlib import Path

# TODO: maybe make this configurable via CLI args?
config = {
    "users": 10000,
    "subreddits": 100,
    "avg_memberships": 3,  # per user
    "posts": 10000,
    "comments": 15000,
    "post_votes": 50000,
    "comment_votes": 25000,
}

rnd = random.Random(42)  # reproducible for testing

def escape_sql(s):
    """escape single quotes for SQL"""
    return "'" + s.replace("'", "''") + "'"

def generate():
    output = []
    
    # Generate all the users first
    user_ids = []
    for i in range(config["users"]):
        user_ids.append(str(uuid.uuid4()))
    
    output.append("\n-- Creating user profiles")
    for idx, user_id in enumerate(user_ids):
        username = f'user_{idx+1:02d}'
        email = f'user_{idx+1:02d}@example.com'
        # Everyone gets the same dummy password for now
        pw = 'hashed_pw'
        
        output.append(f"INSERT INTO profiles (user_id, username, email, pw_hash) VALUES ('{user_id}', {escape_sql(username)}, {escape_sql(email)}, {escape_sql(pw)});")

    # subreddits
    subreddit_ids = [str(uuid.uuid4()) for _ in range(config["subreddits"])]
    output.append("\n-- Subreddits")
    for i, sub_id in enumerate(subreddit_ids):
        admin_user = rnd.choice(user_ids)
        sub_name = f'topic_{i+1:02d}'
        output.append(f"INSERT INTO subreddits (subreddit_id, subreddit_name, admin_id) VALUES ('{sub_id}', {escape_sql(sub_name)}, '{admin_user}');")

    # membership stuff - each user joins some random subs
    memberships_seen = set()
    output.append("\n-- User memberships in subreddits")
    for user in user_ids:
        num_to_join = config["avg_memberships"]
        for _ in range(num_to_join):
            sub = rnd.choice(subreddit_ids)
            membership_key = (user, sub)
            if membership_key in memberships_seen:
                continue  # skip duplicates
            memberships_seen.add(membership_key)
            output.append(f"INSERT INTO subreddit_membership (user_id, subreddit_id) VALUES ('{user}', '{sub}');")

    # posts
    post_ids = []
    for i in range(config["posts"]):
        post_ids.append(str(uuid.uuid4()))
        
    output.append("\n-- Posts")
    for post_num, post_id in enumerate(post_ids, start=1):
        author = rnd.choice(user_ids)
        title = f'Post #{post_num}'
        content = 'Lorem ipsum ...'  # placeholder content
        subreddit = rnd.choice(subreddit_ids)
        
        output.append(f"INSERT INTO posts (post_id, user_id, title, content, subreddit_id) VALUES ('{post_id}', '{author}', {escape_sql(title)}, {escape_sql(content)}, '{subreddit}');")

    # comments on posts
    comment_ids = [str(uuid.uuid4()) for _ in range(config["comments"])]
    output.append("\n-- Comments")
    for comment_id in comment_ids:
        commenter = rnd.choice(user_ids)
        post = rnd.choice(post_ids)
        comment_text = 'Great post!'
        
        output.append(f"INSERT INTO comments (comment_id, content, post_id, user_id) VALUES ('{comment_id}', {escape_sql(comment_text)}, '{post}', '{commenter}');")

    # voting on posts
    output.append("\n-- Post votes")
    post_vote_pairs = set()
    vote_count = 0
    while vote_count < config["post_votes"]:
        voter = rnd.choice(user_ids)
        post = rnd.choice(post_ids)
        pair = (voter, post)
        
        if pair in post_vote_pairs:
            continue
            
        post_vote_pairs.add(pair)
        # bias towards upvotes
        is_upvote = rnd.random() < 0.6
        vote_val = 1 if is_upvote else -1
        
        output.append(f"INSERT INTO votes (user_id, post_id, vote_type) VALUES ('{voter}', '{post}', {vote_val});")
        vote_count += 1

    # comment voting 
    output.append("\n-- Comment votes")
    comment_vote_pairs = set()
    c_vote_count = 0
    target_comment_votes = config["comment_votes"]
    
    while c_vote_count < target_comment_votes:
        voter = rnd.choice(user_ids)
        comment = rnd.choice(comment_ids)
        pair = (voter, comment)
        
        if pair not in comment_vote_pairs:
            comment_vote_pairs.add(pair)
            vote_val = 1 if rnd.random() < 0.55 else -1  # slight upvote bias
            
            output.append(f"INSERT INTO votes_comments (user_id, comment_id, vote_type) VALUES ('{voter}', '{comment}', {vote_val});")
            c_vote_count += 1

    return "\n".join(output)

if __name__ == "__main__":
    # print("Generating seed data...")  # debug
    output_file = Path("seed_reddit.sql").expanduser()
    sql_content = generate()
    output_file.write_text(sql_content, encoding="utf-8")
    
    print(f"✓ done! {output_file}")
