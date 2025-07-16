import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

interface JwtPayload {
  email: string;
  userId: string
}

export function signToken(payload: JwtPayload): string {
  
    if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is missing");
  }

  return jwt.sign(payload, JWT_SECRET);
}

export function verifyToken(token: string) : JwtPayload | null {
  try {
    if (!token || ! JWT_SECRET) {
      throw new Error("Missing Parameter in VerifyToken")
    }
    return jwt.verify(token, JWT_SECRET) as JwtPayload
  } catch {
    return null
  }
}