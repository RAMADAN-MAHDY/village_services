// lib/jwt.ts
import jwt from "jsonwebtoken";

const JWT_SECRET: string = process.env.JWT_SECRET!;

if (!JWT_SECRET) throw new Error("JWT_SECRET not set");

export function generateToken(payload: object, expiresIn = "7d") {
  return jwt.sign(payload, JWT_SECRET, { expiresIn } as jwt.SignOptions);

}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}
