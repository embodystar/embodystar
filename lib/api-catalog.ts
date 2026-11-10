export const apiCatalogLink = '<https://embodystar.com/.well-known/api-catalog>; rel="api-catalog"; type="application/linkset+json"';

export const apiCatalog = {
  linkset: [
    {
      anchor: "https://embodystar.com/",
      service: [
        { href: "https://embodystar.com/", type: "text/markdown" },
      ],
      "service-desc": [
        { href: "https://embodystar.com/openapi.json", type: "application/json" },
      ],
      "service-doc": [
        { href: "https://embodystar.com/api-docs.md", type: "text/markdown" },
      ],
    },
    {
      anchor: "https://embodystar.com/api/a2a",
      service: [
        { href: "https://embodystar.com/api/a2a", type: "application/json" },
      ],
      "service-desc": [
        { href: "https://embodystar.com/a2a-openapi.json", type: "application/json" },
      ],
      "service-doc": [
        { href: "https://embodystar.com/a2a-docs.md", type: "text/markdown" },
      ],
      "service-meta": [
        { href: "https://embodystar.com/.well-known/agent-card.json", type: "application/json" },
      ],
    },
    {
      anchor: "https://embodystar.com/mcp",
      service: [
        { href: "https://embodystar.com/mcp", type: "application/json" },
      ],
      "service-desc": [
        { href: "https://embodystar.com/mcp-openapi.json", type: "application/json" },
      ],
      "service-doc": [
        { href: "https://embodystar.com/mcp-docs.md", type: "text/markdown" },
      ],
      "service-meta": [
        { href: "https://embodystar.com/mcp/server-card", type: "application/mcp-server-card+json" },
        { href: "https://embodystar.com/.well-known/mcp/server-card.json", type: "application/json" },
      ],
    },
  ],
};
