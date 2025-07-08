# drop the create the database
dropdb --if-exists seproject
createdb seproject

# Drop then create the tables in the database then seed it
psql -d seproject -f migrations/reddit_downgrade.sql
psql -d seproject -f migrations/reddit_init.sql  
psql -d seproject -f migrations/reddit_drop_indexes.sql

# Check if production flag is passed, and if yes, then create the indexes
if [ "$1" = "--production" ]; then
    psql -d seproject -f migrations/reddit_create_indexes.sql
fi

psql -d seproject -f scripts/seed_reddit.sql  