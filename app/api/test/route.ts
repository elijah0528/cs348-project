import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    const result = await db.query("SELECT * FROM test");
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Error fetching test data:", error);
    return NextResponse.json(
      { error: "Failed to fetch test data" },
      { status: 500 }
    );
  }
}
