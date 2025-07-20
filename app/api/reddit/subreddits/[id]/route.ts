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
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: subredditId } = await context.params;
    const { searchParams } = new URL(request.url);
    const sort = searchParams.get("sort") === "recent" ? "recent" : "popular";
    const userId = searchParams.get("user_id") || null;
    
    const orderBy = sort === "recent" ? "ORDER BY created_at DESC" : "ORDER BY vote_score DESC, created_at DESC";

    const result = await db.query(
      `WITH all_posts AS (
         SELECT p.post_id, p.user_id, p.title, p.content, p.created_at, s.subreddit_name, pr.username, SUM(v.vote_type) AS vote_score
         FROM posts p
         JOIN subreddits s ON s.subreddit_id = p.subreddit_id
         JOIN profiles pr ON pr.user_id = p.user_id
         JOIN votes v ON v.post_id = p.post_id
         WHERE p.subreddit_id = $1
         GROUP BY p.post_id, p.user_id, p.title, p.content, p.created_at, s.subreddit_name, pr.username

         UNION ALL

         SELECT p.post_id, p.user_id, p.title, p.content, p.created_at, s.subreddit_name, pr.username, 0 AS vote_score
         FROM posts p
         JOIN subreddits s ON s.subreddit_id = p.subreddit_id
         JOIN profiles pr ON pr.user_id = p.user_id
         WHERE p.subreddit_id = $1
           AND NOT EXISTS (
             SELECT 1 FROM votes v WHERE v.post_id = p.post_id
           )
       )
       SELECT *
       FROM all_posts
       ${orderBy}`,
      [subredditId]
    );

    if (result.rows.length === 0) {
      // subreddit without posts returns no post rows; fetch meta
      const meta = await db.query(
        `SELECT s.subreddit_id, s.subreddit_name
         FROM subreddits s WHERE s.subreddit_id = $1`,
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
    };

    let posts = result.rows
      .filter((r) => r.post_id)
      .map((r) => ({
        post_id: r.post_id,
        title: r.title,
        content: r.content,
        created_at: r.created_at,
        user_id: r.user_id,
        score: r.vote_score ?? 0,
        subreddit_name: r.subreddit_name,
        username: r.username,
      }));

    // attach my_vote if userId provided
    if (userId && posts.length > 0) {
      const postIds = posts.map((p) => p.post_id);
      const voteRes = await db.query(
        "SELECT post_id, vote_type FROM votes WHERE user_id = $1 AND post_id = ANY($2)",
        [userId, postIds]
      );
      const voteMap: Record<string, number> = Object.fromEntries(voteRes.rows.map((v:any)=>[v.post_id, v.vote_type]));
      posts = posts.map((p:any)=>({ ...p, my_vote: voteMap[p.post_id] ?? 0 }));
    }

    return NextResponse.json({ subreddit: subredditInfo, posts });
  } catch (error) {
    console.error("Fetch subreddit error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}