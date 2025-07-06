import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { user_id } = await request.json();
    const { id: subreddit_id } = await context.params;

    if (!user_id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // delete the subreddit
    const result = await db.query(
      "DELETE FROM subreddits WHERE subreddit_id = $1 AND admin_id = $2",
      [subreddit_id, user_id]
    );

    return NextResponse.json({
      message: "Subreddit deleted successfully"
    });
  } catch (error) {
    console.error("Delete subreddit error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: subredditId } = await context.params;

    const result = await db.query(
      `SELECT s.subreddit_id, s.subreddit_name, p.username AS admin_username,
        p.post_id, p.title, p.content, p.created_at, pr.username,
        COALESCE(SUM(v.vote_type),0) AS score,
        COUNT(c.comment_id) AS comments_count
       FROM subreddits s
       LEFT OUTER JOIN profiles p ON s.admin_id = p.user_id
       LEFT OUTER JOIN posts p2 ON p2.subreddit_id = s.subreddit_id
       LEFT OUTER JOIN posts p ON p.post_id = p2.post_id
       LEFT OUTER JOIN profiles pr ON pr.user_id = p.user_id
       LEFT OUTER JOIN votes v ON v.post_id = p.post_id
       LEFT JOIN comments c ON c.post_id = p.post_id
       WHERE s.subreddit_id = $1
       GROUP BY s.subreddit_id, s.subreddit_name, admin_username, p.post_id, pr.username
       ORDER BY p.created_at DESC NULLS LAST`,
      [subredditId]
    );

    if (result.rows.length === 0) {
      // subreddit without posts returns no post rows; fetch meta
      const meta = await db.query(
        `SELECT s.subreddit_id, s.subreddit_name, p.username AS admin_username
         FROM subreddits s JOIN profiles p ON s.admin_id = p.user_id WHERE s.subreddit_id = $1`,
        [subredditId]
      );
      if (meta.rows.length === 0) {
        return NextResponse.json({ error: "Subreddit not found" }, { status: 404 });
      }
      return NextResponse.json({ subreddit: meta.rows[0], posts: [] });
    }

    const subredditInfo = {
      subreddit_id: result.rows[0].subreddit_id,
      subreddit_name: result.rows[0].subreddit_name,
      admin_username: result.rows[0].admin_username,
    };

    const posts = result.rows
      .filter((r) => r.post_id)
      .map((r) => ({
        post_id: r.post_id,
        title: r.title,
        content: r.content,
        created_at: r.created_at,
        username: r.username,
        score: r.score,
        comments_count: r.comments_count,
        subreddit_name: r.subreddit_name,
      }));

    return NextResponse.json({ subreddit: subredditInfo, posts });
  } catch (error) {
    console.error("Fetch subreddit error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 