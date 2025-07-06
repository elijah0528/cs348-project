import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id: subredditId } = await context.params;
  const { user_id } = await req.json();
  if (!user_id) return NextResponse.json({ error: "user_id required" }, { status: 400 });
  await db.query(
    `DELETE FROM subreddit_membership WHERE user_id = $1 AND subreddit_id = $2`,
    [user_id, subredditId]
  );
  return NextResponse.json({ message: "left" });
} 