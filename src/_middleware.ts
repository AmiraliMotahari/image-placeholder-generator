import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { rateLimit } from "./lib/redis";
import { formattedResetTimestamp } from "./lib/formatter";

export async function middleware(request: NextRequest) {
  // Derive a “key” per user; IP is common, but you can also use an auth token or user ID
  const ip =
    request.headers.get("x-forwarded-for") ??
    request.headers.get("x-real-ip") ??
    "unknown";

  // Perform the rate-limit check
  const { success, limit, remaining, reset } = await rateLimit.limit(ip);

  // If over the limit, respond with 429 and a Retry‑After header
  if (!success) {
    return new NextResponse("Too Many Requests", {
      status: 429,
      headers: {
        "Retry-After": formattedResetTimestamp(reset), // clients know how long to wait
        "X-RateLimit-Limit": limit.toString(), // total allowed in window
        "X-RateLimit-Remaining": remaining.toString(), // left in this window
      },
    });
  }

  // Otherwise, proceed to your routes/handlers
  return NextResponse.next();
}

// Specify which routes you want to protect (e.g., everything under /api)
export const config = {
  matcher: ["/api/:path*"],
};
