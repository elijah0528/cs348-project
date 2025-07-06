import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id: userId } = await context.params;

    const userRes = await db.query(
      `SELECT user_id, username, email FROM profiles WHERE user_id = $1`,
      [userId]
    );

    if (userRes.rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const postsRes = await db.query(
      `SELECT p.post_id, p.title, p.content, p.created_at, s.subreddit_name
       FROM posts p
       JOIN subreddits s ON p.subreddit_id = s.subreddit_id
       WHERE p.user_id = $1
       ORDER BY p.created_at DESC`,
      [userId]
    );

    const commentsRes = await db.query(
      `SELECT c.comment_id, c.content, c.created_at, p.post_id, p.title AS post_title, s.subreddit_name
       FROM comments c
       JOIN posts p ON c.post_id = p.post_id
       JOIN subreddits s ON p.subreddit_id = s.subreddit_id
       WHERE c.user_id = $1
       ORDER BY c.created_at DESC`,
      [userId]
    );

    return NextResponse.json({
      user: userRes.rows[0],
      posts: postsRes.rows,
      comments: commentsRes.rows,
    });
  } catch (err) {
    console.error("Fetch user data error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 