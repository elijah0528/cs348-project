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

    const pwHash = crypto.createHash('sha256').update(password).digest('hex');

    const result = await db.query(
      "INSERT INTO profiles (username, email, pw_hash) VALUES ($1, $2, $3)",
      [username, email, pwHash]
    );

    return NextResponse.json({
      message: "User created successfully",
      user: result.rows[0]
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 