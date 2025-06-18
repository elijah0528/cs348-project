import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function DELETE(request: NextRequest) {
  try {
    const { user_id } = await request.json();

    if (!user_id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const result = await db.query(
      "DELETE FROM profiles WHERE user_id = $1",
      [user_id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Account deleted successfully",
      deletedUser: result.rows[0].username
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 