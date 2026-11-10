# EmbodyStar Content Agent

The content agent exposes the site's published Markdown overview through A2A 1.0
using JSON-RPC 2.0 over HTTPS. Each valid text request returns the complete current
overview, including exploration areas, conceptual architecture, resources, and FAQs.
Request text does not filter or change the content.

- [Agent Card](https://embodystar.com/.well-known/agent-card.json)
- Service URL: `https://embodystar.com/api/a2a`
- [OpenAPI specification](https://embodystar.com/a2a-openapi.json)
- [API catalog](https://embodystar.com/.well-known/api-catalog)

No authentication, API key, or external model service is required. The agent uses
the same public source content as the website. It does not operate robots, run
inference, store conversations, or create background tasks. Streaming, push
notifications, and extended agent cards are not supported.

## Retrieve the overview

```sh
curl --fail https://embodystar.com/api/a2a \
  --header 'Content-Type: application/json' \
  --header 'A2A-Version: 1.0' \
  --data '{
    "jsonrpc": "2.0",
    "id": "overview-1",
    "method": "SendMessage",
    "params": {
      "message": {
        "messageId": "request-1",
        "role": "ROLE_USER",
        "parts": [{"text": "Get the EmbodyStar project overview."}]
      }
    }
  }'
```

The response echoes the request's JSON-RPC `id` and contains `result.message`:

```json
{
  "jsonrpc": "2.0",
  "id": "overview-1",
  "result": {
    "message": {
      "messageId": "server-generated-id",
      "contextId": "server-generated-context-id",
      "role": "ROLE_AGENT",
      "parts": [{"text": "# EmbodyStar …", "mediaType": "text/markdown"}]
    }
  }
}
```

Inputs must use text parts with `text/plain` or `text/markdown`. Outputs use
`text/markdown`. The JSON request body is limited to 64 KiB.
The endpoint returns JSON-RPC errors for invalid requests, unsupported protocol
versions or content types, and unsupported capabilities. Clients should inspect
the response's `error` field, including when the HTTP status is 200.

Supply `A2A-Version: 1.0` on each call. A same-named query parameter is accepted
when the header is absent. Calls without a version use the protocol's legacy
default and receive a version error. A JSON-RPC request without `id` is a
notification and receives HTTP 204 without content; include `id` to retrieve the
overview. Batches may contain at most 16 requests.

`GetTask` and `CancelTask` return task-not-found errors because this service creates
no tasks. `ListTasks` and other unsupported capabilities return protocol errors.

## Discovery and caching

The public Agent Card supports `GET` and `HEAD`, with an ETag and a five-minute
cache lifetime. Clients can use `If-None-Match` to revalidate the card. The agent's
version and A2A protocol version are separate fields; the current protocol binding
is `JSONRPC` with `protocolVersion: "1.0"`.

For direct content retrieval without A2A, see the
[Markdown interface guide](https://embodystar.com/api-docs.md).
