import { NextResponse  } from "next/server";

export function ServerErrorHandler(err:unknown) {
    if (err instanceof Error) {
        return NextResponse.json({ error: "There was an internal server error"}, { status: 500})
    }
    else {
        return NextResponse.json({},{status: 500})
    }
}