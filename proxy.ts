import { NextResponse, type NextRequest } from "next/server";
import {
  contentSignals,
  homepageMarkdown,
  prefersMarkdown,
} from "./lib/agent-content";
import { apiCatalogLink } from "./lib/api-catalog";

export function proxy(request: NextRequest) {
  const headers = {
    Vary: "Accept",
    "Content-Signal": contentSignals,
    Link: apiCatalogLink,
  };

  if (
    request.nextUrl.pathname === "/" &&
    (request.method === "GET" || request.method === "HEAD") &&
    prefersMarkdown(request.headers.get("accept"))
  ) {
    return new NextResponse(
      request.method === "HEAD" ? null : homepageMarkdown(),
      {
        headers: {
          ...headers,
          "Content-Type": "text/markdown; charset=utf-8",
          // Some CDNs do not key their cache on arbitrary Vary fields.
          "Cache-Control": "no-store",
        },
      },
    );
  }

  return NextResponse.next({ headers });
}

export const config = {
  matcher: "/",
};
