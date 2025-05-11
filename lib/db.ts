import { Pool } from "pg";

if (!process.env.POSTGRES_URL) {
  throw new Error("POSTGRES_URL environment variable is not set");
}

console.log("postgres url: ", process.env.POSTGRES_URL);

const db = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

export default db;
