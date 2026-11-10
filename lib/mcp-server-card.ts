export const mcpEndpoint = "https://embodystar.com/mcp";
export const mcpResourceUri = "https://embodystar.com/";
export const mcpSupportedProtocolVersions = [
  "2026-07-28",
  "2025-11-25",
  "2025-06-18",
  "2025-03-26",
];

export const mcpServerInfo = {
  name: "com.embodystar/content",
  title: "EmbodyStar Content Server",
  version: "1.0.0",
  description:
    "Read EmbodyStar's public project overview, architecture concepts, resources, and FAQs.",
  websiteUrl: "https://embodystar.com",
};

export const mcpCapabilities = {
  tools: { listChanged: false },
  resources: { listChanged: false, subscribe: false },
};

// Compatibility discovery document requested by clients of the original SEP draft.
// Capabilities describe this public, stateless service; clients can verify them live.
export const mcpServerCard = {
  version: "1.0",
  protocolVersion: "2025-11-25",
  serverInfo: mcpServerInfo,
  description: mcpServerInfo.description,
  transport: { type: "streamable-http", endpoint: mcpEndpoint },
  capabilities: mcpCapabilities,
  documentationUrl: "https://embodystar.com/mcp-docs.md",
};

// The accepted SEP-2127 format keeps runtime capabilities in the MCP protocol.
export const canonicalMcpServerCard = {
  $schema:
    "https://static.modelcontextprotocol.io/schemas/v1/server-card.schema.json",
  ...mcpServerInfo,
  remotes: [
    {
      type: "streamable-http",
      url: mcpEndpoint,
      supportedProtocolVersions: mcpSupportedProtocolVersions,
    },
  ],
};

export const aiCatalog = {
  specVersion: "1.0",
  entries: [
    {
      identifier: "urn:air:embodystar.com:mcp:content",
      type: "application/mcp-server-card+json",
      url: `${mcpEndpoint}/server-card`,
    },
  ],
};

export const mcpDiscoveryHeaders = {
  "Cache-Control": "public, max-age=300",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "X-Content-Type-Options": "nosniff",
};
