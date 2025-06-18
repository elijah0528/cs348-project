import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    const result = await db.query(`
      SELECT s.subreddit_id, s.subreddit_name, p.username
      FROM subreddits s
      JOIN profiles p ON s.admin_id = p.user_id
    `);

    return NextResponse.json({
      subreddits: result.rows
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { subreddit_name, admin_id } = await request.json();

    if (!subreddit_name || !admin_id) {
      return NextResponse.json(
        { error: "Subreddit name and admin ID are required" },
        { status: 400 }
      );
    }

    const result = await db.query(
      "INSERT INTO subreddits (subreddit_name, admin_id) VALUES ($1, $2)",
      [subreddit_name, admin_id]
    );

    return NextResponse.json({
      message: "Subreddit created successfully",
      subreddit: result.rows[0]
    });
  } catch (error: any) {

    console.error("Create subreddit error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 