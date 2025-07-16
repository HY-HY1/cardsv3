import { NextResponse  } from "next/server";
import { AppError } from "./Errors";




export function ServerErrorHandler(err: unknown) {
  if (err instanceof AppError) {
    return NextResponse.json({ error: err.message }, { status: err.statusCode });
  }

  if (err instanceof Error) {
    return NextResponse.json({ error: "There was an internal server error" }, { status: 500 });
  }

  return NextResponse.json({}, { status: 500 });
}
