import { Pool } from "pg";
import fs from "fs";
import path from "path";

const db = new Pool({
  connectionString: process.env.POSTGRES_URL,
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
    const statements = sql.split(";").filter((stmt) => stmt.trim());

    for (const statement of statements) {
      const result = await db.query(statement);
      if (result.rows.length > 0) {
        console.table(result.rows);
      } else {
        console.log("No rows returned");
      }
    }
  } catch (error) {
    console.error("Error executing SQL:", error);
    process.exit(1);
  } finally {
    await db.end();
  }
}

main();
