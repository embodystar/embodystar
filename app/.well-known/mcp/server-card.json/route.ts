import { mcpDiscoveryHeaders, mcpServerCard } from "../../../../lib/mcp-server-card";

const headers = { ...mcpDiscoveryHeaders, "Content-Type": "application/json" };

export function GET() {
  return Response.json(mcpServerCard, { headers });
}

export function HEAD() {
  return new Response(null, { headers });
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: { ...mcpDiscoveryHeaders, Allow: "GET, HEAD, OPTIONS" } });
}
