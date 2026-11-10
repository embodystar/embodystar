import {
  createMcpHandler,
  fromJsonSchema,
  McpServer,
  originValidationResponse,
} from "@modelcontextprotocol/server";
import { CfWorkerJsonSchemaValidator } from "@modelcontextprotocol/server/validators/cf-worker";
import { homepageMarkdown } from "./agent-content";
import {
  mcpCapabilities,
  mcpEndpoint,
  mcpResourceUri,
  mcpServerInfo,
  mcpSupportedProtocolVersions,
} from "./mcp-server-card";

// Use the interpreter-backed validator in both Node and Cloudflare Workers.
const validator = new CfWorkerJsonSchemaValidator();
const emptyInput = fromJsonSchema(
  { type: "object", properties: {}, additionalProperties: false },
  validator,
);
const allowedOrigins = [new URL(mcpEndpoint).hostname];
if (process.env.NODE_ENV !== "production")
  allowedOrigins.push("localhost", "127.0.0.1", "[::1]");

const handler = createMcpHandler(
  () => {
    const server = new McpServer(mcpServerInfo, {
      capabilities: mcpCapabilities,
      supportedProtocolVersions: mcpSupportedProtocolVersions,
      jsonSchemaValidator: validator,
      instructions:
        "Read EmbodyStar's published website content. This service does not control robots or perform actions.",
    });

    server.registerTool(
      "get_public_content",
      {
        title: "Read EmbodyStar public content",
        description:
          "Return the public project overview, architecture concepts, resources, and FAQs as Markdown.",
        inputSchema: emptyInput,
        annotations: {
          readOnlyHint: true,
          destructiveHint: false,
          idempotentHint: true,
          openWorldHint: false,
        },
      },
      async () => ({ content: [{ type: "text", text: homepageMarkdown() }] }),
    );

    server.registerResource(
      "public-content",
      mcpResourceUri,
      {
        title: "EmbodyStar public content",
        description: "The canonical homepage content in Markdown.",
        mimeType: "text/markdown",
      },
      async (uri) => ({
        contents: [
          {
            uri: uri.href,
            mimeType: "text/markdown",
            text: homepageMarkdown(),
          },
        ],
      }),
    );

    return server;
  },
  { responseMode: "json", legacy: "stateless", maxRequestBodySize: 64 * 1024 },
);

export async function handleMcpRequest(request: Request): Promise<Response> {
  const response =
    originValidationResponse(request, allowedOrigins) ??
    (await handler.fetch(request));
  response.headers.set("Cache-Control", "no-store");
  return response;
}
