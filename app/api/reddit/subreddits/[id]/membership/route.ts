import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id: subredditId } = await context.params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("user_id");

    if (!userId) {
      return NextResponse.json({ isMember: false });
    }

    const res = await db.query(
      `SELECT 1 FROM subreddit_membership WHERE user_id = $1 AND subreddit_id = $2
       UNION
       SELECT 1 FROM subreddits WHERE admin_id = $1 AND subreddit_id = $2`,
      [userId, subredditId]
    );

    return NextResponse.json({ isMember: res.rows.length > 0 });
  } catch (error) {
    console.error("Check membership error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
