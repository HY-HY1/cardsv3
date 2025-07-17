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

    return NextResponse.json({token : token}, { status: 200})
  } catch (err: unknown) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Something went wrong during login" }, { status: 500 });
  }
}
