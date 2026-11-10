import { homepageMarkdown } from "./agent-content";
import { a2aProtocolVersion } from "./agent-card";

const maxBodyBytes = 64 * 1024;
const maxBatchSize = 16;
const headers = { "Cache-Control": "no-store", "A2A-Version": a2aProtocolVersion };
type JsonObject = Record<string, unknown>;
type RpcId = string | number | null;

function isObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function error(id: RpcId, code: number, message: string) {
  return { jsonrpc: "2.0", id, error: { code, message } };
}

function success(id: RpcId, result: unknown) {
  return { jsonrpc: "2.0", id, result };
}

function mediaType(value: string): string {
  return value.split(";", 1)[0].trim().toLowerCase();
}

function sendMessage(id: RpcId, params: JsonObject) {
  const message = params.message;
  if (!isObject(message) || !isString(message.messageId) ||
      message.role !== "ROLE_USER" || !Array.isArray(message.parts) || message.parts.length === 0) {
    return error(id, -32602, "message requires messageId, ROLE_USER, and at least one text part.");
  }
  for (const field of ["contextId", "taskId"]) {
    if (message[field] !== undefined && !isString(message[field])) {
      return error(id, -32602, `message.${field} must be a nonempty string.`);
    }
  }
  for (const field of ["extensions", "referenceTaskIds"]) {
    if (message[field] !== undefined && !isStringArray(message[field])) {
      return error(id, -32602, `message.${field} must be an array of strings.`);
    }
  }
  if (message.metadata !== undefined && !isObject(message.metadata)) {
    return error(id, -32602, "message.metadata must be an object.");
  }
  for (const part of message.parts) {
    if (!isObject(part)) return error(id, -32602, "Each message part must be an object.");
    if (["text", "raw", "url", "data"].filter((field) => field in part).length !== 1) {
      return error(id, -32602, "Each message part must contain exactly one content field.");
    }
    if (part.mediaType !== undefined && typeof part.mediaType !== "string") {
      return error(id, -32602, "Part mediaType must be a string.");
    }
    if (["raw", "url", "data"].some((field) => field in part) ||
        (typeof part.mediaType === "string" && !["text/plain", "text/markdown"].includes(mediaType(part.mediaType)))) {
      return error(id, -32005, "Only text/plain and text/markdown text parts are supported.");
    }
    if (!isString(part.text)) return error(id, -32602, "Each text part must contain nonempty text.");
    if (part.metadata !== undefined && !isObject(part.metadata)) {
      return error(id, -32602, "Part metadata must be an object.");
    }
  }

  const configuration = params.configuration ?? {};
  if (!isObject(configuration)) return error(id, -32602, "configuration must be an object.");
  if (configuration.blocking !== undefined && typeof configuration.blocking !== "boolean") {
    return error(id, -32602, "configuration.blocking must be a boolean.");
  }
  if (configuration.historyLength !== undefined &&
      (!Number.isInteger(configuration.historyLength) || Number(configuration.historyLength) < 0)) {
    return error(id, -32602, "configuration.historyLength must be a nonnegative integer.");
  }
  if (configuration.taskPushNotificationConfig !== undefined) {
    return error(id, -32003, "Push notifications are not supported.");
  }
  const modes = configuration.acceptedOutputModes;
  if (modes !== undefined && !isStringArray(modes)) {
    return error(id, -32602, "configuration.acceptedOutputModes must be an array of media types.");
  }
  if (modes && modes.length > 0 &&
      !modes.map(mediaType).some((mode) => ["text/markdown", "text/*", "*/*"].includes(mode))) {
    return error(id, -32005, "Accepted output modes must include text/markdown.");
  }
  if (message.taskId !== undefined) {
    return error(id, -32001, "Task not found. This agent returns direct messages without creating tasks.");
  }

  return success(id, {
    message: {
      messageId: crypto.randomUUID(),
      contextId: message.contextId ?? crypto.randomUUID(),
      role: "ROLE_AGENT",
      parts: [{ text: homepageMarkdown(), mediaType: "text/markdown" }],
    },
  });
}

function dispatch(id: RpcId, method: string, params: unknown, version: string) {
  // Protocol compatibility uses major.minor; a supplied patch does not affect it.
  if (version.match(/^(\d+\.\d+)(?:\.\d+)?$/)?.[1] !== a2aProtocolVersion) {
    return error(id, -32009, "This interface supports A2A-Version: 1.0. An absent version means 0.3.");
  }
  if (params !== undefined && !isObject(params)) return error(id, -32602, "params must be an object.");
  const input = (params ?? {}) as JsonObject;
  if (input.tenant !== undefined && input.tenant !== "") {
    return error(id, -32602, "This interface does not declare a tenant.");
  }
  if (input.metadata !== undefined && !isObject(input.metadata)) {
    return error(id, -32602, "metadata must be an object.");
  }
  switch (method) {
    case "SendMessage":
      return sendMessage(id, input);
    case "GetTask":
    case "CancelTask":
      if (!isString(input.id)) return error(id, -32602, "id must be a nonempty task identifier.");
      if (method === "GetTask" && input.historyLength !== undefined &&
          (!Number.isInteger(input.historyLength) || Number(input.historyLength) < 0)) {
        return error(id, -32602, "historyLength must be a nonnegative integer.");
      }
      return error(id, -32001, "Task not found. This agent does not create or store tasks.");
    case "ListTasks":
      return error(id, -32004, "Task listing is not supported. This agent returns direct messages.");
    case "SendStreamingMessage":
    case "SubscribeToTask":
    case "GetExtendedAgentCard":
      return error(id, -32004, "This agent does not support streaming or extended agent cards.");
    case "CreateTaskPushNotificationConfig":
    case "GetTaskPushNotificationConfig":
    case "ListTaskPushNotificationConfigs":
    case "DeleteTaskPushNotificationConfig":
      return error(id, -32003, "Push notifications are not supported.");
    default:
      return error(id, -32601, "Method not found.");
  }
}

function processRequest(payload: unknown, version: string) {
  if (!isObject(payload) || payload.jsonrpc !== "2.0" || !isString(payload.method) ||
      ("id" in payload && payload.id !== null && typeof payload.id !== "string" &&
        (typeof payload.id !== "number" || !Number.isFinite(payload.id)))) {
    return { invalid: true, response: error(null, -32600, "Invalid JSON-RPC 2.0 request.") };
  }
  const response = dispatch((payload.id ?? null) as RpcId, payload.method, payload.params, version);
  // JSON-RPC notifications never receive a response, including on method errors.
  return { invalid: false, response: "id" in payload ? response : null };
}

class BodyTooLargeError extends Error {}

async function readBody(request: Request): Promise<unknown> {
  const declaredLength = request.headers.get("content-length");
  if (declaredLength !== null && Number(declaredLength) > maxBodyBytes) throw new BodyTooLargeError();
  const reader = request.body?.getReader();
  if (!reader) throw new SyntaxError("Missing JSON payload.");
  const decoder = new TextDecoder("utf-8", { fatal: true });
  let bytes = 0;
  let body = "";
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > maxBodyBytes) {
        await reader.cancel();
        throw new BodyTooLargeError();
      }
      body += decoder.decode(value, { stream: true });
    }
    body += decoder.decode();
  } finally {
    reader.releaseLock();
  }
  return JSON.parse(body);
}

export async function handleA2aRequest(request: Request): Promise<Response> {
  if (mediaType(request.headers.get("content-type") ?? "") !== "application/json") {
    return Response.json(error(null, -32600, "Use Content-Type: application/json."), { status: 415, headers });
  }
  let payload: unknown;
  try {
    payload = await readBody(request);
  } catch (cause) {
    return cause instanceof BodyTooLargeError
      ? Response.json(error(null, -32600, "Request body exceeds 64 KiB."), { status: 413, headers })
      : Response.json(error(null, -32700, "Invalid JSON payload."), { status: 400, headers });
  }
  const version = (request.headers.get("a2a-version") ?? new URL(request.url).searchParams.get("A2A-Version") ?? "").trim();
  if (Array.isArray(payload)) {
    if (payload.length === 0) {
      return Response.json(error(null, -32600, "A JSON-RPC batch must not be empty."), { status: 400, headers });
    }
    if (payload.length > maxBatchSize) {
      return Response.json(error(null, -32600, "A batch may contain at most 16 requests."), { status: 413, headers });
    }
    const responses = payload.map((entry) => processRequest(entry, version).response).filter((entry) => entry !== null);
    return responses.length ? Response.json(responses, { headers }) : new Response(null, { status: 204, headers });
  }
  const { response, invalid } = processRequest(payload, version);
  return response ? Response.json(response, { status: invalid ? 400 : 200, headers }) : new Response(null, { status: 204, headers });
}
