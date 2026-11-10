import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import {
  Client,
  StreamableHTTPClientTransport,
} from "@modelcontextprotocol/client";
import { loadTypeScript } from "./helpers/load-typescript.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const serviceUrl = "https://embodystar.com/mcp";
const resourceUri = "https://embodystar.com/";
const cardRoute = () =>
  loadTypeScript("app/.well-known/mcp/server-card.json/route.ts");
const serviceRoute = () => loadTypeScript("app/mcp/route.ts");

function legacyRequest(method, params = {}, headers = {}) {
  return new Request(serviceUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json, text/event-stream",
      "MCP-Protocol-Version": "2025-11-25",
      ...headers,
    },
    body: JSON.stringify({ jsonrpc: "2.0", id: "mcp-test", method, params }),
  });
}

test("MCP discovery publishes compatible cards and a catalog with matching endpoints", async () => {
  const routes = [
    [cardRoute(), "application/json"],
    [
      loadTypeScript("app/mcp/server-card/route.ts"),
      "application/mcp-server-card+json",
    ],
    [
      loadTypeScript("app/.well-known/ai-catalog.json/route.ts"),
      "application/ai-catalog+json",
    ],
  ];
  const documents = [];
  for (const [route, mediaType] of routes) {
    const response = await route.GET();
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("content-type"), mediaType);
    assert.equal(response.headers.get("access-control-allow-origin"), "*");
    assert.match(response.headers.get("cache-control"), /max-age=300/);
    documents.push(await response.json());
    const head = await route.HEAD();
    assert.equal(head.status, 200);
    assert.equal(await head.text(), "");
    for (const header of [
      "content-type",
      "cache-control",
      "access-control-allow-origin",
    ]) {
      assert.equal(head.headers.get(header), response.headers.get(header));
    }
    const options = await route.OPTIONS();
    assert.equal(options.status, 204);
    assert.equal(options.headers.get("access-control-allow-origin"), "*");
    assert.equal(options.headers.get("allow"), "GET, HEAD, OPTIONS");
    assert.equal(await options.text(), "");
  }
  const [compatibility, canonical, catalog] = documents;
  assert.equal(compatibility.serverInfo.name, "com.embodystar/content");
  assert.equal(compatibility.serverInfo.version, "1.0.0");
  assert.equal(compatibility.transport.type, "streamable-http");
  assert.equal(compatibility.transport.endpoint, serviceUrl);
  assert.deepEqual(Object.keys(compatibility.capabilities).sort(), [
    "resources",
    "tools",
  ]);
  assert.equal(
    canonical.$schema,
    "https://static.modelcontextprotocol.io/schemas/v1/server-card.schema.json",
  );
  assert.equal(canonical.name, compatibility.serverInfo.name);
  assert.equal(canonical.version, compatibility.serverInfo.version);
  assert.ok(canonical.description.length > 0);
  assert.equal(canonical.remotes[0].type, "streamable-http");
  assert.equal(canonical.remotes[0].url, serviceUrl);
  assert.ok(
    canonical.remotes[0].supportedProtocolVersions.includes("2026-07-28"),
  );
  assert.ok(
    canonical.remotes[0].supportedProtocolVersions.includes(
      compatibility.protocolVersion,
    ),
  );
  assert.ok(!("capabilities" in canonical));
  assert.ok(
    catalog.entries.some(
      (entry) =>
        entry.url === `${serviceUrl}/server-card` &&
        entry.type === "application/mcp-server-card+json",
    ),
  );
});

for (const era of ["modern", "legacy"]) {
  test(
    `Official MCP client discovers and reads public content using ${era} requests`,
    { timeout: 10000 },
    async () => {
      const requests = [];
      const responses = [];
      const client = new Client(
        { name: "embodystar-integration-test", version: "1.0.0" },
        {
          versionNegotiation: {
            mode: era === "modern" ? { pin: "2026-07-28" } : "legacy",
          },
        },
      );
      const transport = new StreamableHTTPClientTransport(new URL(serviceUrl), {
        fetch: async (input, init) => {
          const request = new Request(input, init);
          assert.equal(request.url, serviceUrl);
          if (request.method === "POST")
            requests.push(await request.clone().json());
          const response = await serviceRoute()[request.method](request);
          responses.push(response);
          return response;
        },
      });
      try {
        await client.connect(transport);
        assert.equal(client.getProtocolEra(), era);
        const card = await (await cardRoute().GET()).json();
        assert.equal(client.getServerVersion().name, card.serverInfo.name);
        assert.equal(
          client.getServerVersion().version,
          card.serverInfo.version,
        );
        assert.deepEqual(client.getServerCapabilities(), card.capabilities);

        const { tools } = await client.listTools();
        assert.deepEqual(
          tools.map((tool) => tool.name),
          ["get_public_content"],
        );
        assert.equal(tools[0].annotations.readOnlyHint, true);
        assert.equal(tools[0].annotations.destructiveHint, false);
        assert.equal(tools[0].annotations.idempotentHint, true);
        assert.equal(tools[0].annotations.openWorldHint, false);
        const expected = loadTypeScript(
          "lib/agent-content.ts",
        ).homepageMarkdown();
        const content = await client.callTool({
          name: "get_public_content",
          arguments: {},
        });
        assert.ok(!content.isError);
        assert.deepEqual(content.content, [{ type: "text", text: expected }]);

        const { resources } = await client.listResources();
        assert.equal(resources.length, 1);
        assert.equal(resources[0].uri, resourceUri);
        assert.equal(resources[0].mimeType, "text/markdown");
        const result = await client.readResource({ uri: resourceUri });
        assert.deepEqual(result.contents, [
          { uri: resourceUri, mimeType: "text/markdown", text: expected },
        ]);
        if (era === "modern") {
          const invalid = await client.callTool({
            name: "get_public_content",
            arguments: { url: "https://untrusted.example/" },
          });
          assert.equal(invalid.isError, true);
          assert.ok(!invalid.content.some((part) => part.text === expected));
          await assert.rejects(
            client.readResource({ uri: "https://untrusted.example/private" }),
            /not found/i,
          );
        }
        assert.ok(
          responses.every(
            (response) => !response.headers.has("mcp-session-id"),
          ),
        );
        assert.equal(
          requests[0].method,
          era === "modern" ? "server/discover" : "initialize",
        );
        if (era === "modern")
          assert.ok(
            !requests.some((request) => request.method === "initialize"),
          );
      } finally {
        await client.close();
      }
    },
  );
}

test("Every advertised older MCP revision can initialize and retrieve the listed tool", async () => {
  const { mcpSupportedProtocolVersions } = loadTypeScript(
    "lib/mcp-server-card.ts",
  );
  const { protocolVersion } = await (await cardRoute().GET()).json();
  for (const version of mcpSupportedProtocolVersions.filter(
    (value) => value.startsWith("2025-") && value !== protocolVersion,
  )) {
    const headers = { "MCP-Protocol-Version": version };
    const initialize = await serviceRoute().POST(
      legacyRequest(
        "initialize",
        {
          protocolVersion: version,
          capabilities: {},
          clientInfo: { name: "embodystar-legacy-test", version: "1.0.0" },
        },
        headers,
      ),
    );
    assert.equal(initialize.status, 200);
    const initialized = await legacyResult(initialize);
    assert.equal(initialized.result.protocolVersion, version);
    const listed = await serviceRoute().POST(
      legacyRequest("tools/list", {}, headers),
    );
    assert.equal(listed.status, 200);
    assert.deepEqual(
      (await legacyResult(listed)).result.tools.map((tool) => tool.name),
      ["get_public_content"],
    );
  }
});

async function legacyResult(response) {
  if (response.headers.get("content-type").startsWith("application/json"))
    return response.json();
  const data = (await response.text())
    .split("\n")
    .find((line) => line.startsWith("data: "));
  assert.ok(data, "Legacy SSE exchange contains a JSON-RPC response");
  return JSON.parse(data.slice(6));
}

test("MCP API catalog links resolve to matching docs and a working OpenAPI example", async () => {
  const { apiCatalog } = loadTypeScript("lib/api-catalog.ts");
  const entry = apiCatalog.linkset.find((item) => item.anchor === serviceUrl);
  assert.ok(entry);
  assert.equal(entry.service[0].href, serviceUrl);
  assert.equal(entry["service-meta"][0].href, `${serviceUrl}/server-card`);
  const specUrl = new URL(entry["service-desc"][0].href);
  const docsUrl = new URL(entry["service-doc"][0].href);
  assert.equal(specUrl.origin, "https://embodystar.com");
  assert.equal(docsUrl.origin, specUrl.origin);
  const spec = JSON.parse(
    fs.readFileSync(path.join(root, "public", specUrl.pathname), "utf8"),
  );
  const docs = fs.readFileSync(
    path.join(root, "public", docsUrl.pathname),
    "utf8",
  );
  const card = await (await cardRoute().GET()).json();
  assert.equal(spec.info.version, card.serverInfo.version);
  assert.equal(spec.externalDocs.url, docsUrl.href);
  assert.equal(card.documentationUrl, docsUrl.href);
  assert.ok(docs.includes(specUrl.href));
  assert.equal(new URL("/mcp", spec.servers[0].url).href, serviceUrl);
  const operation = spec.paths["/mcp"].post;
  const example = operation.requestBody.content["application/json"].example;
  const documented = JSON.parse(docs.match(/--data '([^']+)'/)[1]);
  assert.deepEqual(documented, example);
  const response = await serviceRoute().POST(
    new Request(serviceUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json, text/event-stream",
        "MCP-Protocol-Version":
          example.params._meta["io.modelcontextprotocol/protocolVersion"],
        "Mcp-Method": example.method,
        "Mcp-Name": example.params.name,
      },
      body: JSON.stringify(example),
    }),
  );
  const body = await response.json();
  assert.equal(response.status, 200, JSON.stringify(body));
  assert.equal(
    body.result.content[0].text,
    loadTypeScript("lib/agent-content.ts").homepageMarkdown(),
  );
});

test("MCP rejects untrusted browser origins while accepting canonical and server clients", async () => {
  for (const origin of [
    "https://untrusted.example",
    "https://embodystar.com.untrusted.example",
    "null",
  ]) {
    const response = await serviceRoute().POST(
      legacyRequest("tools/list", {}, { Origin: origin }),
    );
    assert.equal(response.status, 403, origin);
  }
  for (const headers of [{}, { Origin: "https://embodystar.com" }]) {
    const response = await serviceRoute().POST(
      legacyRequest("tools/list", {}, headers),
    );
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("cache-control"), "no-store");
    // The SDK uses request-scoped SSE for its legacy transport compatibility.
    await response.text();
  }
});

test("MCP enforces its request bound and does not open persistent GET or DELETE sessions", async () => {
  for (const method of ["GET", "DELETE"]) {
    const response = await serviceRoute()[method](
      new Request(serviceUrl, { method }),
    );
    assert.equal(response.status, 405);
  }
  const response = await serviceRoute().POST(
    legacyRequest("tools/list", { padding: "x".repeat(65536) }),
  );
  assert.equal(response.status, 413);
  const declared = await serviceRoute().POST(
    legacyRequest("tools/list", {}, { "Content-Length": "65537" }),
  );
  assert.equal(declared.status, 413);
});
