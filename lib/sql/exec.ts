import { Pool } from "pg";
import fs from "fs";
import path from "path";

console.log("postgres url: ", process.env.POSTGRES_URL);

const db = new Pool({
  connectionString:
    process.env.POSTGRES_URL || "postgres://postgres:@127.0.0.1:5432/cs348",
});

async function main() {
  const fileName = process.argv
    .find((arg) => arg.startsWith("--file="))
    ?.split("=")[1];
  if (!fileName) {
    console.error("Please provide a file name using --file=<filename>");
    process.exit(1);
  }

  const sqlFile = fileName.endsWith(".sql") ? fileName : fileName + ".sql";
  const filePath = path.join(__dirname, sqlFile);

  if (!fs.existsSync(filePath)) {
    console.error(`SQL file not found: ${sqlFile}`);
    process.exit(1);
  }

  try {
    const sql = fs.readFileSync(filePath, "utf-8");

    // Execute the entire file at once so that PL/pgSQL blocks (which contain
    // many internal semicolons) are sent to the server intact. PostgreSQL will
    // happily execute multiple commands in a single query string.
    const result = await db.query(sql);

    if (result?.rows?.length) {
      console.table(result.rows);
    }
  } catch (error) {
    console.error("Error executing SQL:", error);
    process.exit(1);
  } finally {
    await db.end();
  }
}

main();
