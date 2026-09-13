import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { UnauthorizedError, ForbiddenError } from "@/lib/rbac/errors";

export function jsonOk<T>(data: T, init?: number | ResponseInit) {
  return NextResponse.json({ data }, typeof init === "number" ? { status: init } : init);
}

export function jsonError(
  status: number,
  code: string,
  message: string,
  fields?: Record<string, string[]>
) {
  return NextResponse.json({ error: { code, message, fields } }, { status });
}

/**
 * Maps a caught error from a route handler to the API's standard error
 * envelope. Keeps every route's catch block identical instead of
 * re-deriving status codes ad hoc per route.
 */
export function toErrorResponse(err: unknown) {
  if (err instanceof ZodError) {
    return jsonError(400, "VALIDATION_ERROR", "Invalid input", err.flatten().fieldErrors);
  }
  if (err instanceof UnauthorizedError) {
    return jsonError(401, "UNAUTHORIZED", err.message);
  }
  if (err instanceof ForbiddenError) {
    return jsonError(403, "FORBIDDEN", err.message);
  }
  console.error(err);
  return jsonError(500, "INTERNAL_ERROR", "Something went wrong");
}
