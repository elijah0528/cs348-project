import { Pool } from "pg";

// if (
//   !process.env.POSTGRES_URL ||
//   !process.env.POSTGRES_USER ||
//   !process.env.POSTGRES_HOST ||
//   !process.env.POSTGRES_DATABASE ||
//   !process.env.POSTGRES_PASSWORD
// ) {
//   throw new Error("Missing environment variables");
// }

const db = new Pool({
  connectionString: "postgres://postgres:@127.0.0.1:5432/cs348",
  // user: process.env.POSTGRES_USER,
  // host: process.env.POSTGRES_HOST,
  // database: process.env.POSTGRES_DATABASE,
  // password: process.env.POSTGRES_PASSWORD,
  // port: 5432,
});

export default db;
