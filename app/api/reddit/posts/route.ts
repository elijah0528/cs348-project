import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { title, content, subreddit_id, user_id } = await request.json();

    if (!title || !content || !subreddit_id || !user_id) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const result = await db.query(
      `INSERT INTO posts (title, content, subreddit_id, user_id) VALUES ($1, $2, $3, $4) RETURNING post_id`,
      [title, content, subreddit_id, user_id]
    );

    return NextResponse.json({ message: "Post created", post_id: result.rows[0].post_id });
  } catch (err) {
    console.error("Create post error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 