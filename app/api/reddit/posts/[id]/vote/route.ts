import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id: postId } = await context.params;
  const { user_id, vote_type } = await request.json(); // vote_type can be -1, 0, 1
  if (!user_id || vote_type === undefined) {
    return NextResponse.json({ error: "user_id and vote_type required" }, { status: 400 });
  }
  if (![ -1, 0, 1].includes(vote_type)) {
    return NextResponse.json({ error: "vote_type must be -1, 0, or 1" }, { status: 400 });
  }
  // remove any existing vote
  await db.query("DELETE FROM votes WHERE user_id = $1 AND post_id = $2", [user_id, postId]);

  // insert new vote if not removing (vote_type !== 0)
  if (vote_type !== 0) {
    await db.query("INSERT INTO votes (user_id, post_id, vote_type) VALUES ($1, $2, $3)", [user_id, postId, vote_type]);
  }

  const scoreRes = await db.query("SELECT SUM(vote_type) AS score FROM votes WHERE post_id = $1", [postId]);
  const score = scoreRes.rows[0].score ?? 0;
  return NextResponse.json({ score });
} 