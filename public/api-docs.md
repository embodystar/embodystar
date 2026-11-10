# EmbodyStar Public Content API

Read the public project overview, exploration areas, conceptual architecture,
open-source resources, and FAQs at `https://embodystar.com/`.
This interface is read-only and requires no authentication or API key.

## Read the content

```sh
curl --fail --header 'Accept: text/markdown' https://embodystar.com/
```

A successful request returns HTTP 200 with `Content-Type: text/markdown; charset=utf-8`.
The response contains the same public information as the website, formatted for
automated clients. No query parameters or request body are required.

HTML is the default when `Accept` is omitted or contains only a wildcard. When
requesting multiple formats, Markdown must be explicitly accepted with a positive
quality at least as high as the HTML alternative. Use `Accept: text/markdown` when
you need a predictable Markdown response.

Markdown responses include `Vary: Accept`, `Cache-Control: no-store`, and
`Content-Signal: ai-train=yes, search=yes, ai-input=yes`.

## Inspect headers

```sh
curl --head --header 'Accept: text/markdown' https://embodystar.com/
```

`HEAD /` uses the same content negotiation and returns headers without a response
body. There is no separate health endpoint.

## Discover the interface

- [OpenAPI 3.1 specification](https://embodystar.com/openapi.json)
- [RFC 9727 API catalog](https://embodystar.com/.well-known/api-catalog)

The catalog returns `application/linkset+json` and links this interface to its
specification and documentation. Homepage and catalog responses also include a
`Link` header with the `api-catalog` relation. The catalog supports `GET` and `HEAD`;
write methods are not supported.

The robot visualization and architecture JSON shown on the website are educational
examples. This content interface provides no robot-control, inference, training,
account, or payment operations.
