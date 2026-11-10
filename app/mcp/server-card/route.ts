import {
  canonicalMcpServerCard,
  mcpDiscoveryHeaders,
} from "../../../lib/mcp-server-card";

const headers = {
  ...mcpDiscoveryHeaders,
  "Content-Type": "application/mcp-server-card+json",
};

export function GET() {
  return Response.json(canonicalMcpServerCard, { headers });
}

export function HEAD() {
  return new Response(null, { headers });
}

export function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: { ...mcpDiscoveryHeaders, Allow: "GET, HEAD, OPTIONS" },
  });
}
