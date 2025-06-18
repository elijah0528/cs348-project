# drop the create the database
dropdb --if-exists seproject
createdb seproject

# Drop then create the tables in the database then seed it
psql -d seproject -f migrations/reddit_downgrade.sql
psql -d seproject -f migrations/reddit_init.sql  
psql -d seproject -f scripts/seed_reddit.sql  