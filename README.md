# Weddit (CS348 Project)

Weddit is a Reddit-style web app built with Next.js and Postgres. The UI and API live under
`app/`, and the SQL milestone artifacts are in `m1/`, `m2/`, and `m3/`.

## Features

- User registration, login, and logout
- Subreddits with membership
- Posts, comments, and voting
- Personalized feed and recommended subreddits

## Tech stack

- Next.js 15, React 19, TypeScript
- Postgres 17
- Tailwind CSS

## Prerequisites

- Node.js and npm
- Postgres 17
- Python 3 (only needed to regenerate production seed data)

## Environment

Create a `.env` file in the project root:

```
POSTGRES_URL="postgres://postgres:@127.0.0.1:5432/cs348"
```

## Database setup

Create the database:

```
psql -U postgres -c "CREATE DATABASE cs348;"
```

Initialize the schema:

```
cd lib/sql
npm run sql -- --file=migrations/reddit_init.sql
```

## Seed data

Sample data:

```
cd lib/sql
npm run sql -- --file=scripts/seed_reddit_sample.sql
```

Production data:

```
cd lib/sql
npm run sql -- --file=scripts/seed_reddit.sql
```

To switch datasets, re-run the schema migration before seeding again:

```
cd lib/sql
npm run sql -- --file=migrations/reddit_init.sql
npm run sql -- --file=scripts/seed_reddit.sql
```

To regenerate the production seed file:

```
cd lib/sql/scripts
python3 gen.py
```

## Run locally

```
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

## Scripts

- `npm run dev` - start development server
- `npm run build` - production build
- `npm run lint` - lint checks
- `npm run sql -- --file=<path>` - execute SQL file

## SQL milestone artifacts

- `m1/` - feature queries and output files
- `m2/` - sample/production queries and optimization notes
- `m3/` - advanced query tasks

## API routes

Auth:
- `POST /api/reddit/auth/login`
- `POST /api/reddit/auth/register`
- `DELETE /api/reddit/auth/delete`
- `POST /api/auth/logout`

Posts:
- `POST /api/reddit/posts`
- `GET /api/reddit/posts/[id]`
- `PATCH /api/reddit/posts/[id]`
- `POST /api/reddit/posts/[id]/vote`

Comments:
- `POST /api/reddit/comments`
- `POST /api/reddit/comments/[id]/vote`

Subreddits:
- `GET /api/reddit/subreddits`
- `POST /api/reddit/subreddits`
- `GET /api/reddit/subreddits/[id]`
- `DELETE /api/reddit/subreddits/[id]`
- `POST /api/reddit/subreddits/[id]/join`
- `DELETE /api/reddit/subreddits/[id]/leave`
- `GET /api/reddit/subreddits/[id]/membership`

Feed and recommendations:
- `GET /api/reddit/feed/[id]`
- `GET /api/reddit/membership/[id]`
- `GET /api/reddit/recommended`

User:
- `GET /api/reddit/user/[id]`

Test:
- `GET /api/test`
