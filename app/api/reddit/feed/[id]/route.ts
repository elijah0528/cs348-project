import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id: userId } = await context.params;
    const { searchParams } = new URL(request.url);
    const sortParam = searchParams.get("sort");
    const sort: "recent" | "popular" | "trending" =
      sortParam === "popular" ? "popular" : sortParam === "trending" ? "trending" : "recent";

    const recentQuery = `SELECT p.post_id, p.user_id, p.title, p.content, p.created_at, pr.username, s.subreddit_name, s.subreddit_id, SUM(v.vote_type) AS vote_score
        FROM posts p
        LEFT OUTER JOIN votes v ON v.post_id = p.post_id
        JOIN subreddits s ON p.subreddit_id = s.subreddit_id
        JOIN profiles pr ON pr.user_id = p.user_id
        WHERE (
          p.subreddit_id IN (SELECT subreddit_id FROM subreddit_membership WHERE user_id = $1)
          OR p.subreddit_id IN (SELECT subreddit_id FROM subreddits WHERE admin_id = $1)
        )
        GROUP BY p.post_id, p.user_id, p.title, p.content, p.created_at, pr.username, s.subreddit_name, s.subreddit_id
        ORDER BY p.created_at DESC`;

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

    // Trending: score = vote_score / pow(age_days+0.5, 1.5)
    const trendingQuery = `WITH all_posts AS (
       SELECT p.post_id, p.user_id, p.title, p.content, p.created_at, s.subreddit_name, pr.username,
              COALESCE(SUM(v.vote_type), 0) AS vote_score,
              EXTRACT(EPOCH FROM NOW() - p.created_at)/86400 AS age_days
       FROM posts p
       JOIN subreddits s ON s.subreddit_id = p.subreddit_id
       JOIN profiles pr ON pr.user_id = p.user_id
       JOIN votes v ON v.post_id = p.post_id
       WHERE (
         p.subreddit_id IN (SELECT subreddit_id FROM subreddit_membership WHERE user_id = $1)
         OR p.subreddit_id IN (SELECT subreddit_id FROM subreddits WHERE admin_id = $1)
       )
       GROUP BY p.post_id, p.user_id, p.title, p.content, p.created_at, s.subreddit_name, pr.username
    )
    SELECT *, vote_score / POWER(age_days + 0.5, 1.5) AS trending_score
    FROM all_posts
    ORDER BY trending_score DESC`;

    const queryToRun = sort === "popular" ? popularQuery : sort === "trending" ? trendingQuery : recentQuery;

    const res = await db.query(queryToRun, [userId]);
    const rows = res.rows;
    const postIds = rows.map((r:any)=>r.post_id);

    // fetch current user's vote for these posts
    let voteMap: Record<string, number> = {};
    if (postIds.length > 0) {
      const voteRes = await db.query(
        "SELECT post_id, vote_type FROM votes WHERE user_id = $1 AND post_id = ANY($2)",
        [userId, postIds]
      );
      voteMap = Object.fromEntries(voteRes.rows.map((v:any)=>[v.post_id, v.vote_type]));
    }

    const posts = rows.map((r:any)=>({
      ...r,
      score: r.vote_score ?? 0,
      my_vote: voteMap[r.post_id] ?? 0
    }));
    return NextResponse.json({ posts });
  } catch (err) {
    console.error("feed error", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 