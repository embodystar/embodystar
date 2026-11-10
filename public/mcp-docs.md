# EmbodyStar MCP content service

Connect an MCP client to `https://embodystar.com/mcp` using Streamable HTTP.
The public service requires no credentials. It returns the same Markdown overview
as `GET https://embodystar.com/` with `Accept: text/markdown`.

## Discovery

- Compatibility Server Card: https://embodystar.com/.well-known/mcp/server-card.json
- Current Server Card: https://embodystar.com/mcp/server-card
- AI Catalog: https://embodystar.com/.well-known/ai-catalog.json
- API catalog: https://embodystar.com/.well-known/api-catalog
- OpenAPI description: https://embodystar.com/mcp-openapi.json

The compatibility card follows the original server-card proposal's
`serverInfo`, `transport.endpoint`, and `capabilities` layout. The accepted
[SEP-2127](https://github.com/modelcontextprotocol/modelcontextprotocol/pull/2127)
uses a separate card containing identity and `remotes`, linked from the AI Catalog.
The current card uses `application/mcp-server-card+json`; the compatibility card
uses `application/json`. Both support GET and HEAD, public CORS, and a five-minute
cache lifetime. Runtime discovery and listing operations describe live capabilities.

## Available content

`tools/list` exposes one tool, `get_public_content`, with an empty object as its
input. `tools/call` returns the complete project overview as Markdown text.
The tool is read-only and idempotent.

`resources/list` exposes the `public-content` resource at
`https://embodystar.com/`. `resources/read` with that URI returns the same overview
with MIME type `text/markdown`. Other resource URIs are not fetched.

The content includes the project description, illustrative architecture,
open-source resources, and FAQs. The service does not control robots, run model
inference, browse arbitrary URLs, store conversations, or change data. Prompts,
resource subscriptions, and list-change notifications are not offered.

## Protocol

The service uses the official MCP TypeScript SDK's Web Standard HTTP handler.
It supports the current `2026-07-28` protocol and stateless compatibility with
`2025-11-25`, `2025-06-18`, and `2025-03-26` clients. Current clients can use
`server/discover`; older clients can use `initialize` followed by
`notifications/initialized`. No session ID or persistent connection is needed.

Current protocol requests include matching `MCP-Protocol-Version` headers and
`params._meta["io.modelcontextprotocol/protocolVersion"]` values, plus
`params._meta["io.modelcontextprotocol/clientCapabilities"]` (an empty object
for this example). Supply
`Mcp-Method` matching the method and `Mcp-Name` matching the tool name or resource
URI when applicable. The official client SDK supplies these automatically.

Example using the current protocol:

```sh
curl --fail-with-body https://embodystar.com/mcp \
  --header 'Content-Type: application/json' \
  --header 'Accept: application/json, text/event-stream' \
  --header 'MCP-Protocol-Version: 2026-07-28' \
  --header 'Mcp-Method: tools/call' \
  --header 'Mcp-Name: get_public_content' \
  --data '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"get_public_content","arguments":{},"_meta":{"io.modelcontextprotocol/protocolVersion":"2026-07-28","io.modelcontextprotocol/clientCapabilities":{}}}}'
```

Requests use POST and JSON-RPC 2.0. Current protocol responses use JSON; legacy
responses use a request-scoped SSE event. Accepted notifications return HTTP 202
with no body. Request bodies are limited to 64 KiB. GET and DELETE
on `/mcp` return HTTP 405 because the service does not maintain SSE sessions.
The SDK validates protocol envelopes, versions, headers, and arguments. Requests
from native clients without an Origin header are accepted; browser requests are
restricted to the site's hostname. No bearer token is required.

After deployment, POST `{"url":"https://embodystar.com"}` as JSON to
`https://isitagentready.com/api/scan` and confirm
`checks.discovery.mcpServerCard.status` is `"pass"`.
