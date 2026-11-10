---
name: get-public-content
description: "Retrieve EmbodyStar's public project overview, conceptual architecture, resource links, and FAQs. Use when asked about EmbodyStar or when another agent needs its published content."
---

# Retrieve EmbodyStar public content

Fetch the current overview as Markdown:

```sh
curl --fail --show-error --silent --max-time 20 \
  --header 'Accept: text/markdown' https://embodystar.com/
```

Check for HTTP 200 and a `text/markdown` response before using the result. The
explicit `Accept` header matters: a normal browser request returns HTML.
No API key or authentication is required.

Use the returned content to answer the user's question and cite
https://embodystar.com/ as the source. Distinguish conceptual robotics examples
from implemented capabilities; the content service does not operate hardware or
run model inference. If retrieval fails, report that the current content could
not be fetched rather than inventing project details.

## A2A clients

When the caller uses A2A, discover the service through
https://embodystar.com/.well-known/agent-card.json and use its advertised interface.
The current interface accepts A2A 1.0 JSON-RPC `SendMessage` requests:

```sh
curl --fail --show-error --silent --max-time 20 \
  https://embodystar.com/api/a2a \
  --header 'Content-Type: application/json' \
  --header 'A2A-Version: 1.0' \
  --data '{"jsonrpc":"2.0","id":"overview-1","method":"SendMessage","params":{"message":{"messageId":"request-1","role":"ROLE_USER","parts":[{"text":"Get the EmbodyStar project overview."}]}}}'
```

Read the Markdown in `result.message.parts[].text`. Check the JSON-RPC `error`
field even when HTTP returns 200. Each valid text request returns the complete
overview; request text does not filter the response. The service creates no
background tasks and stores no conversation history.

For interface details, consult the [Markdown guide](https://embodystar.com/api-docs.md)
or [A2A guide](https://embodystar.com/a2a-docs.md) when needed.
