import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id: postId } = await context.params;

    const postRes = await db.query(
      `WITH voted AS (
         SELECT p.post_id, p.title, p.content, p.created_at, pr.username,
                SUM(v.vote_type) AS score
         FROM posts p
         JOIN votes v ON v.post_id = p.post_id
         JOIN profiles pr ON pr.user_id = p.user_id
         WHERE p.post_id = $1
         GROUP BY p.post_id, pr.username
       ),
       novote AS (
         SELECT p.post_id, p.title, p.content, p.created_at, pr.username,
                0 AS score
         FROM posts p
         JOIN profiles pr ON pr.user_id = p.user_id
         WHERE p.post_id = $1
           AND NOT EXISTS (SELECT 1 FROM votes v WHERE v.post_id = p.post_id)
       )
       SELECT * FROM voted
       UNION ALL
       SELECT * FROM novote`,
      [postId]
    );

    if (postRes.rows.length === 0) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const commentsRes = await db.query(
      `WITH voted_c AS (
         SELECT c.comment_id, c.content, c.created_at, pr.username,
                SUM(vc.vote_type) AS score
         FROM comments c
         JOIN votes_comments vc ON vc.comment_id = c.comment_id
         JOIN profiles pr ON pr.user_id = c.user_id
         WHERE c.post_id = $1
         GROUP BY c.comment_id, pr.username
       ),
       novote_c AS (
         SELECT c.comment_id, c.content, c.created_at, pr.username,
                0 AS score
         FROM comments c
         JOIN profiles pr ON pr.user_id = c.user_id
         WHERE c.post_id = $1
           AND NOT EXISTS (SELECT 1 FROM votes_comments vc WHERE vc.comment_id = c.comment_id)
       )
       SELECT * FROM voted_c
       UNION ALL
       SELECT * FROM novote_c
       ORDER BY created_at ASC`,
      [postId]
    );

    return NextResponse.json({ post: postRes.rows[0], comments: commentsRes.rows });
  } catch (err) {
    console.error("Fetch post error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id: postId } = await context.params;
    const { content } = await req.json();

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    await db.query(
      "UPDATE posts SET content = $1 WHERE post_id = $2", 
      [content, postId]
    );

    return NextResponse.json({ message: "Post updated successfully" });
  } catch (err) {
    console.error("Update post error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 