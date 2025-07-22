import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

/**
 * GET /api/reddit/recommended?userId=<uuid>
 *
 * Returns a list of recommended subreddits for the given user based on collaborative filtering:
 * 1. Find posts the user has up-voted.
 * 2. Find other users who have also up-voted those posts.
 * 3. Collect the subreddits those users belong to that the current user is **not** a member of.
 *
 * The query uses several CTEs as specified by the requirements and an EXCEPT clause to
 * exclude subreddits the user already belongs to.
 */
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
        return NextResponse.json(
            { error: "Missing required query param: userId" },
            { status: 400 }
        );
    }

    try {
        const sql = `
        WITH my_upvoted_posts AS (
            SELECT post_id
            FROM votes
            WHERE user_id = $1 AND vote_type = 1
        ),
        similar_users AS (
            SELECT DISTINCT v.user_id
            FROM votes v
            JOIN my_upvoted_posts mup ON mup.post_id = v.post_id
            WHERE v.vote_type = 1 AND NOT (v.user_id = $1)
        ),
        their_subreddits AS (
            SELECT sm.subreddit_id, COUNT(*) AS similar_member_count
            FROM subreddit_membership sm
            JOIN similar_users su ON su.user_id = sm.user_id
            GROUP BY sm.subreddit_id
        ),
        my_subreddits AS (
            SELECT subreddit_id FROM subreddit_membership WHERE user_id = $1
        ),
        candidate_ids AS (
            SELECT subreddit_id FROM their_subreddits
            EXCEPT
            SELECT subreddit_id FROM my_subreddits
        )
        SELECT s.subreddit_id,
            s.subreddit_name,
            ts.similar_member_count
        FROM candidate_ids c
        JOIN their_subreddits ts USING (subreddit_id)
        JOIN subreddits s USING (subreddit_id)
        ORDER BY ts.similar_member_count DESC, s.subreddit_name
        LIMIT 20;
    `;

        const result = await db.query(sql, [userId]);

        return NextResponse.json({ recommended: result.rows });
    } catch (error) {
        console.error("Error fetching recommended subreddits:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
