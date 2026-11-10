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
  ],
};
