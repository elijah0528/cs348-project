# AGENTS.md

This file tells automated coding agents (and humans) how to work in this repo safely and efficiently.

## Project overview

- **App**: Next.js 15 (App Router) web app (a Reddit-like “Weddit”).
- **Data**: PostgreSQL (README suggests Postgres 17).
- **SQL tooling**: `npm run sql` executes `.sql` files via `lib/sql/exec.ts`.

## Repo layout (high-level)

- `app/`: Next.js App Router pages and API routes (`app/api/**/route.ts`).
- `components/`: React components (UI, sidebar, posts, auth, etc.).
- `lib/`: shared utilities, auth cookie helpers, Postgres pool, SQL runner + migrations/seeds.
- `lib/sql/migrations/`: schema + indexing migrations.
- `lib/sql/scripts/`: seed scripts (sample + production) and generation helpers.
- `m1/`, `m2/`, `m3/`: milestone query files and outputs.

## Prerequisites

- Node.js + npm (see `package.json`).
- PostgreSQL running locally.

## Environment variables

- Create `.env` at the repo root (you can copy `.env.template`).
- Required:
  - `POSTGRES_URL` (example): `postgres://postgres:@127.0.0.1:5432/cs348`

## Database setup

The SQL runner (`npm run sql`) resolves `--file=...` **relative to `lib/sql`** (because it joins the provided path with `__dirname` inside `lib/sql/exec.ts`). That means you should pass paths like `migrations/reddit_init.sql`, not `lib/sql/migrations/reddit_init.sql`.

### Initialize schema

- `npm run sql -- --file=migrations/reddit_init.sql`

### Seed data

- **Sample data**: `npm run sql -- --file=scripts/seed_reddit_sample.sql`
- **Production data**: `npm run sql -- --file=scripts/seed_reddit.sql`

### Switching seed types

Re-run init, then seed again:

- `npm run sql -- --file=migrations/reddit_init.sql`
- `npm run sql -- --file=scripts/seed_reddit_sample.sql` (or `scripts/seed_reddit.sql`)

### Running milestone SQL files

Because `--file` is relative to `lib/sql`, milestone SQL files live “one directory up”:

- `npm run sql -- --file=../m1/feature1.sql`
- `npm run sql -- --file=../m2/feature3-sample.sql`
- `npm run sql -- --file=../m3/sql/advanced1.sql`

## Local development

- Install deps: `npm install`
- Run dev server: `npm run dev`
- Open: `http://localhost:3000`

## Common commands

- Dev: `npm run dev`
- Lint: `npm run lint`
- Build: `npm run build`
- Run SQL file: `npm run sql -- --file=<path-relative-to-lib/sql>`

## Coding conventions (agent guidance)

- **TypeScript strict**: keep types sound; avoid `any` unless unavoidable.
- **Next.js App Router**: use `app/**/page.tsx` and `app/api/**/route.ts` patterns consistently.
- **DB access**: prefer parameterized queries; don’t interpolate untrusted user input into SQL strings.
- **Avoid secret leakage**: don’t add logs that print `POSTGRES_URL`, cookies, auth headers, or full request bodies. If you add debugging logs temporarily, remove them before committing.
- **Keep changes scoped**: don’t reformat unrelated files; prefer small, reviewable commits.

## Testing expectations

There is no dedicated test runner configured in `package.json`. For confidence:

- Run `npm run lint` for TypeScript/Next lint.
- Run `npm run build` to ensure production compilation succeeds when changing app code.

