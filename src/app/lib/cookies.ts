import { serialize } from "cookie";
import { NextResponse } from "next/server";

const TOKEN_NAME = "token";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 أيام

export function setTokenCookie(response: NextResponse, token: string) {
  const cookie = serialize(TOKEN_NAME, token, {
    maxAge: MAX_AGE,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  });

  response.headers.append("Set-Cookie", cookie);
}
