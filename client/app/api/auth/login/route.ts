import { NextResponse } from "next/server";
import { MongoConnect } from "@/lib/mongo/MongoConnect";
import { getUserByEmail } from "@/utils/cache/userCache";
import { CompareHash } from "@/utils/hashing/hashing";
import { signToken } from "@/utils/jwt/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Fields are missing" }, { status: 400 });
    }

    await MongoConnect();

    const existingUser = await getUserByEmail(email);

    if (!existingUser) {
      return NextResponse.json({ error: "Credentials Are Incorrect" }, { status: 400 });
    }

    const passwordMatch = await CompareHash({
      original: existingUser.password,
      str: password,
    });

    if (!passwordMatch) {
      return NextResponse.json({ error: "Credentials Are Incorrect" }, { status: 403 });
    }

    const jwtPayload = {
      userId: existingUser.userId,
      email: existingUser.email,
    };

    const token = signToken(jwtPayload);

    const response = NextResponse.redirect(new URL("/app", req.url));

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24, 
      sameSite: "lax",
    });

    return response;
  } catch (err: unknown) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Something went wrong during login" }, { status: 500 });
  }
}
