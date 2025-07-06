import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id: userId } = await context.params;
    const { searchParams } = new URL(request.url);
    const sort = searchParams.get("sort") === "popular" ? "popular" : "recent";

    const recentQuery = `SELECT p.post_id, p.title, p.content, p.created_at, pr.username,
                              s.subreddit_name, s.subreddit_id, SUM(v.vote_type) AS score
                         FROM posts p
                         LEFT JOIN votes v ON v.post_id = p.post_id
                         JOIN subreddits s ON p.subreddit_id = s.subreddit_id
                         JOIN profiles pr ON pr.user_id = p.user_id
                         WHERE (
                           p.subreddit_id IN (SELECT subreddit_id FROM subreddit_membership WHERE user_id = $1)
                           OR p.subreddit_id IN (SELECT subreddit_id FROM subreddits WHERE admin_id = $1)
                         )
                         GROUP BY p.post_id, pr.username, s.subreddit_name, s.subreddit_id
                         ORDER BY p.created_at DESC`;

    const popularQuery = `SELECT p.post_id, p.title, p.content, p.created_at, pr.username,
                                s.subreddit_name, s.subreddit_id, SUM(v.vote_type) AS score
                           FROM posts p
                           LEFT JOIN votes v ON v.post_id = p.post_id
                           JOIN subreddits s ON p.subreddit_id = s.subreddit_id
                           JOIN profiles pr ON pr.user_id = p.user_id
                           WHERE (
                             p.subreddit_id IN (SELECT subreddit_id FROM subreddit_membership WHERE user_id = $1)
                             OR p.subreddit_id IN (SELECT subreddit_id FROM subreddits WHERE admin_id = $1)
                           )
                           GROUP BY p.post_id, pr.username, s.subreddit_name, s.subreddit_id
                           ORDER BY score DESC NULLS LAST`;

    const queryToRun = sort === "popular" ? popularQuery : recentQuery;

    const res = await db.query(queryToRun, [userId]);
    const posts = res.rows.map((r:any)=>({ ...r, score: r.score ?? 0 }));
    return NextResponse.json({ posts });
  } catch (err) {
    console.error("feed error", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 