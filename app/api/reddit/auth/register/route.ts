import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const { username, email, password } = await request.json();

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "Username, email, and password are required" },
        { status: 400 }
      );
    }

    const user_id = crypto.randomUUID();

    const pwHash = crypto.createHash("sha256").update(password).digest("hex");

    await db.query(
      "INSERT INTO profiles (user_id, username, email, pw_hash) VALUES ($1, $2, $3, $4)",
      [user_id, username, email, pwHash]
    );

    const user = { user_id, username, email };

    const res = NextResponse.json({
      message: "User created successfully",
      user,
    });

    // set http-only cookie so server components can read current user
    res.cookies.set("weddit_user", JSON.stringify(user), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (error: any) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
