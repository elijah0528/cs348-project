import { Pool } from "pg";

const db = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

export default db;
