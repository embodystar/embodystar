import { apiCatalog, apiCatalogLink } from "../../../lib/api-catalog";

const headers = {
  "Content-Type": 'application/linkset+json; profile="https://www.rfc-editor.org/info/rfc9727"',
  Link: apiCatalogLink,
};

export function GET() {
  return Response.json(apiCatalog, { headers });
}

export function HEAD() {
  return new Response(null, { headers });
}
