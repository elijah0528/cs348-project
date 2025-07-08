import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id: userId } = await context.params;
    const { searchParams } = new URL(request.url);
    const sort = searchParams.get("sort") === "popular" ? "popular" : "recent";

    const recentQuery = `WITH all_posts AS (
       SELECT p.post_id, p.user_id, p.title, p.content, p.created_at, s.subreddit_name, pr.username, SUM(v.vote_type) AS vote_score
       FROM posts p
       JOIN subreddits s ON s.subreddit_id = p.subreddit_id
       JOIN profiles pr ON pr.user_id = p.user_id
       JOIN votes v ON v.post_id = p.post_id
       WHERE (
         p.subreddit_id IN (SELECT subreddit_id FROM subreddit_membership WHERE user_id = $1)
         OR p.subreddit_id IN (SELECT subreddit_id FROM subreddits WHERE admin_id = $1)
       )
       GROUP BY p.post_id, p.user_id, p.title, p.content, p.created_at, s.subreddit_name, pr.username

       UNION ALL

       SELECT p.post_id, p.user_id, p.title, p.content, p.created_at, s.subreddit_name, pr.username, 0 AS vote_score
       FROM posts p
       JOIN subreddits s ON s.subreddit_id = p.subreddit_id
       JOIN profiles pr ON pr.user_id = p.user_id
       WHERE (
         p.subreddit_id IN (SELECT subreddit_id FROM subreddit_membership WHERE user_id = $1)
         OR p.subreddit_id IN (SELECT subreddit_id FROM subreddits WHERE admin_id = $1)
       )
         AND NOT EXISTS (
           SELECT 1 FROM votes v WHERE v.post_id = p.post_id
         )
     )
     SELECT *
     FROM all_posts
     ORDER BY created_at DESC`;

    const popularQuery = `WITH all_posts AS (
       SELECT p.post_id, p.user_id, p.title, p.content, p.created_at, s.subreddit_name, pr.username, SUM(v.vote_type) AS vote_score
       FROM posts p
       JOIN subreddits s ON s.subreddit_id = p.subreddit_id
       JOIN profiles pr ON pr.user_id = p.user_id
       JOIN votes v ON v.post_id = p.post_id
       WHERE (
         p.subreddit_id IN (SELECT subreddit_id FROM subreddit_membership WHERE user_id = $1)
         OR p.subreddit_id IN (SELECT subreddit_id FROM subreddits WHERE admin_id = $1)
       )
       GROUP BY p.post_id, p.user_id, p.title, p.content, p.created_at, s.subreddit_name, pr.username

       UNION ALL

       SELECT p.post_id, p.user_id, p.title, p.content, p.created_at, s.subreddit_name, pr.username, 0 AS vote_score
       FROM posts p
       JOIN subreddits s ON s.subreddit_id = p.subreddit_id
       JOIN profiles pr ON pr.user_id = p.user_id
       WHERE (
         p.subreddit_id IN (SELECT subreddit_id FROM subreddit_membership WHERE user_id = $1)
         OR p.subreddit_id IN (SELECT subreddit_id FROM subreddits WHERE admin_id = $1)
       )
         AND NOT EXISTS (
           SELECT 1 FROM votes v WHERE v.post_id = p.post_id
         )
     )
     SELECT *
     FROM all_posts
     ORDER BY vote_score DESC, created_at DESC`;

    const queryToRun = sort === "popular" ? popularQuery : recentQuery;

    const res = await db.query(queryToRun, [userId]);
    const posts = res.rows.map((r:any)=>({ ...r, score: r.vote_score ?? 0 }));
    return NextResponse.json({ posts });
  } catch (err) {
    console.error("feed error", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 