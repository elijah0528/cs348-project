# Weddit (CS348 Project)

Weddit is a Reddit-style web app built for the CS348 database systems course. It showcases a
Postgres-backed schema, SQL migrations and seeds, and a full-stack Next.js UI.

## Features
- User authentication (register, login, logout)
- Subreddit creation, membership, and moderation
- Posts and comments with voting
- Personalized feeds and recommended subreddits
- User profiles with posts and comments

## Tech Stack
- Next.js 15 + React 19 + TypeScript
- Postgres 17 (`pg`)
- Tailwind CSS + Radix UI + Sonner

## Getting Started

### Prerequisites
- Node.js (LTS) and npm
- Postgres 17

### 1) Install dependencies
```bash
npm install
```

### 2) Configure environment
Copy `.env.template` to `.env` and set `POSTGRES_URL`.

```
POSTGRES_URL="postgres://postgres:@127.0.0.1:5432/cs348"
```

### 3) Create the database
```bash
psql -U postgres -c "CREATE DATABASE cs348;"
```

### 4) Run migrations
```bash
npm run sql -- --file=migrations/reddit_init.sql
```

### 5) Seed data
Sample data:
```bash
npm run sql -- --file=scripts/seed_reddit_sample.sql
```

Production data:
```bash
npm run sql -- --file=scripts/seed_reddit.sql
```

If you switch between sample and production data, re-run the migration before seeding again.

### 6) Start the app
```bash
npm run dev
```

Open `http://localhost:3000` (you will be redirected to `/auth`).

## SQL Runner
Use `npm run sql -- --file=<path>` to execute SQL files. Paths are resolved relative to
`lib/sql`.

Common examples:
```bash
npm run sql -- --file=migrations/reddit_init.sql
npm run sql -- --file=scripts/seed_reddit_sample.sql
npm run sql -- --file=../../m1/feature1.sql
npm run sql -- --file=../../m2/feature1-sample.sql
npm run sql -- --file=../../m3/queries/advanced1-sample.sql
```

## Production Seed Generation (Optional)
To regenerate the large production seed file:

```bash
python3 lib/sql/scripts/gen.py
```

This generates `lib/sql/scripts/seed_reddit.sql` with:
- 10,000 users
- 100 subreddits
- 3 memberships per user
- 10,000 posts
- 15,000 comments
- 50,000 post votes + 25,000 comment votes

## Scripts
| Script | Description |
| --- | --- |
| `npm run dev` | Start the Next.js dev server (Turbopack) |
| `npm run build` | Create a production build |
| `npm run start` | Run the production server |
| `npm run lint` | Run Next.js linting |
| `npm run sql -- --file=...` | Execute a SQL file via `lib/sql/exec.ts` |

## API Routes
### Auth
- `POST /api/reddit/auth/login`
- `POST /api/reddit/auth/register`
- `DELETE /api/reddit/auth/delete`
- `POST /api/auth/logout`

### Posts
- `POST /api/reddit/posts`
- `GET /api/reddit/posts/[id]`
- `PATCH /api/reddit/posts/[id]`
- `POST /api/reddit/posts/[id]/vote`

### Comments
- `POST /api/reddit/comments`
- `POST /api/reddit/comments/[id]/vote`

### Subreddits
- `GET /api/reddit/subreddits`
- `POST /api/reddit/subreddits`
- `GET /api/reddit/subreddits/[id]`
- `DELETE /api/reddit/subreddits/[id]`
- `POST /api/reddit/subreddits/[id]/join`
- `DELETE /api/reddit/subreddits/[id]/leave`
- `GET /api/reddit/subreddits/[id]/membership`

### Feeds & User
- `GET /api/reddit/feed/[id]`
- `GET /api/reddit/recommended`
- `GET /api/reddit/membership/[id]`
- `GET /api/reddit/user/[id]`

### Misc
- `GET /api/test`

## Project Structure
```
app/            # Next.js app router (pages + API routes)
components/     # UI components
lib/            # DB helpers, auth, utilities
lib/sql/        # Migrations, seeds, SQL runner
m1/, m2/, m3/   # Milestone SQL files and outputs
```

## UI Snapshot
![Weddit UI](https://github.com/user-attachments/assets/b89669d7-1d5a-4fef-98a0-25fbef5272e9)

## Team
- Ishaan
- Rajan
- Elijah
- Ian
