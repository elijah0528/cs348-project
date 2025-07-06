import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id: userId } = await context.params;
  const res = await db.query(
    `SELECT subreddit_id FROM subreddit_membership WHERE user_id = $1`,
    [userId]
  );
  return NextResponse.json({ subredditIds: res.rows.map((r) => r.subreddit_id) });
} 