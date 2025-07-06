import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id: commentId } = await context.params;
  const { user_id, vote_type } = await request.json();
  if (!user_id || vote_type === undefined) {
    return NextResponse.json({ error: "user_id and vote_type required" }, { status: 400 });
  }
  if (![ -1, 0, 1].includes(vote_type)) {
    return NextResponse.json({ error: "vote_type must be -1, 0, or 1" }, { status: 400 });
  }
  await db.query("DELETE FROM votes_comments WHERE user_id = $1 AND comment_id = $2", [user_id, commentId]);

  if (vote_type !== 0) {
    await db.query("INSERT INTO votes_comments (user_id, comment_id, vote_type) VALUES ($1, $2, $3)", [user_id, commentId, vote_type]);
  }

  const scoreRes = await db.query("SELECT SUM(vote_type) AS score FROM votes_comments WHERE comment_id = $1", [commentId]);
  const score = scoreRes.rows[0].score ?? 0;
  return NextResponse.json({ score });
} 