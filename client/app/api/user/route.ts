import { NextResponse } from "next/server";
import { User } from "@/lib/models/User";
import { verifyToken } from "@/utils/jwt/auth";
import { error } from "console";
import { getUserByEmail } from "@/utils/cache/userCache";

export async function GET(res:  Response) {
    try {
        const token = res.headers.get("authorization");

        if(!token) {
            return NextResponse.json({ error: "No token Provided"}, {status: 400 })
        }

        const verifiedToken = verifyToken(token)

        if (!verifiedToken) {
            return NextResponse.json({ error: "Token is invalid"}, { status: 403})
        }

        const user = await getUserByEmail(verifiedToken.email)

        return NextResponse.json({ decoded: verifiedToken, user: user}, {status: 200})


    } catch (err: unknown) {
        return NextResponse.json(
            { error: "There was an error"},
            { status: 500}
        )
    }
}