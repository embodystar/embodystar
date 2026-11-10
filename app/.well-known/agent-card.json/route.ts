import { agentCard } from "../../../lib/agent-card";

const etag = `W/"agent-card-${agentCard.version}"`;
const headers = {
  "Content-Type": "application/json",
  "Cache-Control": "public, max-age=300",
  ETag: etag,
};

function notModified(request?: Request) {
  return request?.headers
    .get("if-none-match")
    ?.split(",")
    .some((value) => {
      const tag = value.trim();
      return (
        tag === "*" || tag.replace(/^W\//, "") === etag.replace(/^W\//, "")
      );
    });
}

export function GET(request?: Request) {
  if (notModified(request)) return new Response(null, { status: 304, headers });
  return Response.json(agentCard, { headers });
}

export function HEAD(request?: Request) {
  return new Response(null, {
    status: notModified(request) ? 304 : 200,
    headers,
  });
}
