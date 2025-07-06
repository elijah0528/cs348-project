import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { content, post_id, user_id } = await request.json();

    if (!content || !post_id || !user_id) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await db.query(
      `INSERT INTO comments (content, post_id, user_id) VALUES ($1, $2, $3)`,
      [content, post_id, user_id]
    );

    return NextResponse.json({ message: "Comment added" });
  } catch (err) {
    console.error("Create comment error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 