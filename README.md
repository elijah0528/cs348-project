# CS348 Project

Ishaan, Rajan, Elijah, Ian

README.txt to describe how to create and load your sample database on your chosen platform.
You don’t have to use the datasets described in the report. Toy datasets (e.g., a single table) can
be used.

## Local Development

Make sure you have Postgres 17 installed, then create a database called `cs348`:

```bash
psql -U postgres -c "CREATE DATABASE cs348;"
```

Create a `.env` file in the project root with the following connection string:

```
POSTGRES_URL="postgres://postgres:@127.0.0.1:5432/cs348"
```

Run the initial migration

```bash
cd lib/sql
npm run sql -- --file=migrations/reddit_init.sql
```

To populate with **sample** data, run the sample seed file.

```bash
cd lib/sql
npm run sql -- --file=scripts/seed_reddit_sample.sql
```

To populate with **production** data, run the production seed file.

```bash
cd lib/sql
npm run sql -- --file=scripts/seed_reddit.sql
```

If you wish to switch between sample and production data, you should first init again, then seed again. For example,

```bash
cd lib/sql
npm run sql -- --file=migrations/reddit_init.sql
npm run sql -- --file=scripts/seed_reddit.sql
```

Start the local development server

```bash
npm i
npm run dev
```

Open `localhost:3000` in your browser. The log in page for Weddit will be displayed.

## Milestone 1 Features

You can view the `m1` folder for the SQl queries for each feature, where features 1, 2 and 4 have before and after logic to show the effect of the feature on the tables. These are in `.out` files.

To test a SQL feature, run the following command:

```bash
npm run sql -- --file=../../m1/feature1.sql
```

## Milestone 2 Features

These are, similarly, in the `m2` folder. There are two types of files, sample and production, each with a sql and out file. The production files have minor modifications for ids and limits for visibility purposes. To view the entire production database, visit `seed_reddit.sql` in the `lib/sql/scripts` folder. This was generated from `gen.py` in the `lib/sql/migrations` folder.

To generate the production database, run the following command:

```bash
cd lib/sql/migrations
python3 gen.py seed_reddit.sql
```

### Implementation of features

We have `api` endpoints for each core feature seen in the `app/api/reddit` folder. We implemented two of the four features from the milestone 1 list, the ability to create and delete a user. These can be found in `app/api/reddit/auth/register` and `app/api/reddit/auth/delete` respectively.

We also implemented the ability to select, create and delete a subreddit, which can be found in `app/api/reddit/subreddits/create`. This is the first feature that requires a user to be logged in.

### Current Interface (will be updated)

<img width="1709" alt="image" src="https://github.com/user-attachments/assets/b89669d7-1d5a-4fef-98a0-25fbef5272e9" />

