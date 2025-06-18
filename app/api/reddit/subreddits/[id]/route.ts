import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { user_id } = await request.json();
    const subreddit_id = params.id;

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