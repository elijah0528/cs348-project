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
npm run sql -- --file=migrations/init.sql
````

Run the seed file to populate the database with sample data

```bash
cd lib/sql
npm run sql -- --file=scripts/init-seed.sql
```

Start the local development server

```bash
npm i
npm run dev
```

Open localhost:3000 in your browser. The sample data from the database will be displayed.