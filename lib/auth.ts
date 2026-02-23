import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export function signAccessToken(payload: any) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "15m",
  });
}

export function signRefreshToken(payload: any) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "7d",
  });
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET);
}
