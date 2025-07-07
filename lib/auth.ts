"use server";

import { cookies } from "next/headers";

export interface User {
  user_id: string;
  username: string;
}

export async function getUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get("weddit_user");

    if (!userCookie?.value) {
      return null;
    }

    return JSON.parse(userCookie.value);
  } catch {
    return null;
  }
}

export async function setUserCookie(user: User) {
  const cookieStore = await cookies();
  cookieStore.set("weddit_user", JSON.stringify(user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function clearUserCookie() {
  const cookieStore = await cookies();
  cookieStore.delete("weddit_user");
}
