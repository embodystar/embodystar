import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import ts from "typescript";
import testing from "next/experimental/testing/server.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// Exercise the route handlers without adding a separate test-runner dependency.
function loadTypeScript(relativePath) {
  const filename = path.resolve(root, relativePath);
  const localRequire = createRequire(filename);
  const exports = {};
  const code = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const requireModule = (specifier) => specifier.startsWith(".")
    ? loadTypeScript(path.resolve(path.dirname(filename), `${specifier}.ts`))
    : localRequire(specifier);
  new Function("require", "exports", code)(requireModule, exports);
  return exports;
}

const cardUrl = "https://embodystar.com/.well-known/agent-card.json";
const serviceUrl = "https://embodystar.com/api/a2a";
const cardRoute = () => loadTypeScript("app/.well-known/agent-card.json/route.ts");
const serviceRoute = () => loadTypeScript("app/api/a2a/route.ts");

function messageRequest(overrides = {}) {
  return {
    jsonrpc: "2.0",
    id: "content-request",
    method: "SendMessage",
    params: {
      message: {
        messageId: "client-message",
        role: "ROLE_USER",
        parts: [{ text: "Get the public project overview.", mediaType: "text/plain" }],
      },
    },
    ...overrides,
  };
}

async function post(body, headers = {}) {
  return serviceRoute().POST(new Request(serviceUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json", "A2A-Version": "1.0", ...headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
  }));
}

async function expectError(response, code, id) {
  assert.match(response.headers.get("content-type"), /^application\/json/);
  const body = await response.json();
  assert.equal(body.jsonrpc, "2.0");
  assert.equal(body.error.code, code);
  assert.equal(typeof body.error.message, "string");
  assert.ok(body.error.message.length > 0);
  assert.ok(!("result" in body));
  if (id !== undefined) assert.equal(body.id, id);
  return body;
}

test("Agent Card advertises a real A2A 1.0 content interface with complete skill metadata", async () => {
  const response = await cardRoute().GET(new Request(cardUrl));
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type"), /^application\/json/);
  const card = await response.json();
  for (const field of ["name", "version", "description"]) {
    assert.equal(typeof card[field], "string");
    assert.ok(card[field].trim().length > 0);
  }
  assert.ok(card.supportedInterfaces.length > 0);
  for (const entry of card.supportedInterfaces) {
    assert.equal(entry.url, serviceUrl);
    assert.equal(entry.protocolBinding, "JSONRPC");
    assert.equal(entry.protocolVersion, "1.0");
  }
  assert.deepEqual(card.defaultInputModes, ["text/plain", "text/markdown"]);
  assert.deepEqual(card.defaultOutputModes, ["text/markdown"]);
  for (const capability of ["streaming", "pushNotifications", "extendedAgentCard"]) {
    assert.equal(card.capabilities[capability], false);
  }
  assert.ok(card.skills.length > 0);
  const ids = new Set();
  for (const skill of card.skills) {
    for (const field of ["id", "name", "description"]) {
      assert.equal(typeof skill[field], "string");
      assert.ok(skill[field].trim().length > 0);
    }
    assert.ok(!ids.has(skill.id));
    ids.add(skill.id);
    assert.ok(Array.isArray(skill.tags) && skill.tags.length > 0);
    assert.ok(skill.tags.every((tag) => typeof tag === "string" && tag.length > 0));
  }
  assert.ok(ids.has("get-public-content"));
});

test("Agent Card GET and HEAD support conditional caching without response bodies", async () => {
  const route = cardRoute();
  const get = await route.GET(new Request(cardUrl));
  const etag = get.headers.get("etag");
  assert.ok(etag);
  assert.match(get.headers.get("cache-control"), /(?:^|,)\s*public(?:,|$)/);
  assert.match(get.headers.get("cache-control"), /max-age=300/);
  const head = await route.HEAD(new Request(cardUrl, { method: "HEAD" }));
  assert.equal(head.status, 200);
  assert.equal(await head.text(), "");
  for (const header of ["content-type", "cache-control", "etag"]) {
    assert.equal(head.headers.get(header), get.headers.get(header));
  }
  const strongEtag = etag.replace(/^W\//, "");
  for (const validator of [strongEtag, `W/${strongEtag}`, `"another-version", ${etag}`, "*"]) {
    for (const method of ["GET", "HEAD"]) {
      const response = await route[method](new Request(cardUrl, {
        method,
        headers: { "If-None-Match": validator },
      }));
      assert.equal(response.status, 304, `${method} ${validator}`);
      assert.equal(response.headers.get("etag"), etag);
      assert.equal(await response.text(), "");
    }
  }
  const fresh = await route.GET(new Request(cardUrl, { headers: { "If-None-Match": '"older-version"' } }));
  assert.equal(fresh.status, 200);
  assert.ok((await fresh.json()).skills.length > 0);
});

test("Agent Card, catalog, specification, and usage documentation identify the same service", async () => {
  const card = await (await cardRoute().GET(new Request(cardUrl))).json();
  const { apiCatalog } = loadTypeScript("lib/api-catalog.ts");
  const entry = apiCatalog.linkset.find(({ anchor }) => anchor === card.supportedInterfaces[0].url);
  assert.ok(entry, "The A2A service must be listed in the public catalog");
  assert.ok(entry["service-meta"].some(({ href }) => href === cardUrl));
  assert.ok(entry["service-doc"].some(({ href }) => href === card.documentationUrl));
  const specUrl = new URL(entry["service-desc"][0].href);
  const docsUrl = new URL(card.documentationUrl);
  assert.equal(specUrl.origin, "https://embodystar.com");
  assert.equal(docsUrl.origin, "https://embodystar.com");
  const spec = JSON.parse(fs.readFileSync(path.join(root, "public", specUrl.pathname), "utf8"));
  const docs = fs.readFileSync(path.join(root, "public", docsUrl.pathname), "utf8");
  assert.equal(spec.info.version, card.version);
  assert.ok(spec.paths[new URL(serviceUrl).pathname].post);
  assert.ok(spec.paths[new URL(cardUrl).pathname].get);
  assert.ok(spec.paths[new URL(cardUrl).pathname].head);
  for (const expected of [serviceUrl, cardUrl, specUrl.href, "A2A-Version: 1.0", "SendMessage"]) {
    assert.ok(docs.includes(expected), expected);
  }
  const { config } = loadTypeScript("proxy.ts");
  for (const url of [serviceUrl, cardUrl, specUrl.href, docsUrl.href]) {
    assert.equal(testing.unstable_doesMiddlewareMatch({ config, nextConfig: {}, url: new URL(url).pathname }), false, url);
  }
});

test("SendMessage returns the published Markdown as an immediate A2A message", async () => {
  const { homepageMarkdown } = loadTypeScript("lib/agent-content.ts");
  for (const id of [0, "content-request"]) {
    const response = await post(messageRequest({ id }));
    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type"), /^application\/json/);
    assert.equal(response.headers.get("cache-control"), "no-store");
    const body = await response.json();
    assert.equal(body.jsonrpc, "2.0");
    assert.equal(body.id, id);
    assert.ok(!("error" in body));
    assert.ok(!("task" in body.result));
    const message = body.result.message;
    assert.equal(message.role, "ROLE_AGENT");
    assert.equal(typeof message.messageId, "string");
    assert.ok(message.messageId.length > 0);
    assert.notEqual(message.messageId, "client-message");
    assert.equal(typeof message.contextId, "string");
    assert.ok(message.contextId.length > 0);
    assert.deepEqual(message.parts, [{ text: homepageMarkdown(), mediaType: "text/markdown" }]);
  }
});

test("SendMessage preserves a supplied context while generating independent response message IDs", async () => {
  const request = messageRequest();
  request.params.message.contextId = "public-content-context";
  request.params.message.parts = [{ text: "# Read the overview", mediaType: "text/markdown" }];
  const first = await (await post(request)).json();
  const second = await (await post(request)).json();
  assert.equal(first.result.message.contextId, "public-content-context");
  assert.equal(second.result.message.contextId, "public-content-context");
  assert.notEqual(first.result.message.messageId, second.result.message.messageId);
  assert.equal(first.result.message.parts[0].text, second.result.message.parts[0].text);
});

test("unsupported protocol versions return the A2A version error", async () => {
  await expectError(await post(messageRequest(), { "A2A-Version": "0.3" }), -32009, "content-request");
  const request = new Request(serviceUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(messageRequest()),
  });
  await expectError(await serviceRoute().POST(request), -32009, "content-request");
  const patchVersion = await post(messageRequest(), { "A2A-Version": "1.0.2" });
  assert.ok((await patchVersion.json()).result.message);
});

test("malformed JSON and invalid JSON-RPC envelopes produce protocol errors", async () => {
  await expectError(await post("{broken"), -32700, null);
  for (const value of [null, true, [], { jsonrpc: "1.0", id: 1, method: "SendMessage" }, { jsonrpc: "2.0", id: {}, method: "SendMessage" }]) {
    await expectError(await post(value), -32600);
  }
  await expectError(await post(messageRequest({ method: "UnknownMethod" })), -32601, "content-request");
});

test("SendMessage validates required fields and the text part union", async () => {
  const invalidMessages = [
    null,
    {},
    { messageId: "client-message", role: "ROLE_USER", parts: [] },
    { messageId: "client-message", role: "ROLE_AGENT", parts: [{ text: "Hello" }] },
    { role: "ROLE_USER", parts: [{ text: "Hello" }] },
    { messageId: "client-message", role: "ROLE_USER", parts: [{ text: 42 }] },
    { messageId: "client-message", role: "ROLE_USER", parts: [{ text: "Hello", data: {} }] },
  ];
  for (const message of invalidMessages) {
    await expectError(await post(messageRequest({ params: { message } })), -32602, "content-request");
  }
  await expectError(await post(messageRequest({ params: {} })), -32602, "content-request");
});

test("SendMessage rejects input and output types the Agent Card does not advertise", async () => {
  for (const part of [{ data: { topic: "overview" } }, { text: "Hello", mediaType: "text/html" }, { url: "https://example.com/input.txt" }]) {
    const request = messageRequest();
    request.params.message.parts = [part];
    await expectError(await post(request), -32005, "content-request");
  }
  const request = messageRequest();
  request.params.configuration = { acceptedOutputModes: ["application/json"] };
  await expectError(await post(request), -32005, "content-request");

  request.params.configuration = { acceptedOutputModes: ["text/markdown"] };
  const supported = await (await post(request)).json();
  assert.equal(supported.result.message.parts[0].mediaType, "text/markdown");
});

test("streaming, notifications, and extended cards report their unavailable capabilities", async () => {
  for (const [method, code] of [
    ["SendStreamingMessage", -32004],
    ["SubscribeToTask", -32004],
    ["CreateTaskPushNotificationConfig", -32003],
    ["GetTaskPushNotificationConfig", -32003],
    ["GetExtendedAgentCard", -32004],
  ]) {
    await expectError(await post(messageRequest({ method })), code, "content-request");
  }
});

test("task identifiers cannot imply stored work in the stateless content service", async () => {
  for (const method of ["GetTask", "CancelTask"]) {
    await expectError(await post(messageRequest({ method, params: { id: "missing-task" } })), -32001, "content-request");
  }
  const request = messageRequest();
  request.params.message.taskId = "missing-task";
  await expectError(await post(request), -32001, "content-request");
});

test("the service enforces its request size limit on streamed request bodies", async () => {
  for (const text of ["x".repeat(65_537), "🙂".repeat(17_000)]) {
    const request = messageRequest();
    request.params.message.parts[0].text = text;
    const response = await post(request);
    assert.equal(response.status, 413);
    assert.equal(response.headers.get("cache-control"), "no-store");
  }
});

test("JSON-RPC notifications have no response and batches preserve request IDs", async () => {
  const notification = messageRequest();
  delete notification.id;
  const response = await post(notification);
  assert.equal(response.status, 204);
  assert.equal(await response.text(), "");

  const batch = await (await post([
    messageRequest({ id: 0 }),
    notification,
    messageRequest({ id: "unknown", method: "UnknownMethod" }),
  ])).json();
  assert.equal(batch.length, 2);
  assert.equal(batch[0].id, 0);
  assert.ok(batch[0].result.message);
  assert.equal(batch[1].id, "unknown");
  assert.equal(batch[1].error.code, -32601);
  const notifications = await post([notification, notification]);
  assert.equal(notifications.status, 204);
  assert.equal(await notifications.text(), "");
});

test("non-JSON requests and oversized batches are rejected before processing", async () => {
  const nonJson = await post(messageRequest(), { "Content-Type": "text/plain" });
  assert.equal(nonJson.status, 415);
  await expectError(nonJson, -32600);
  const tooMany = await post(Array.from({ length: 17 }, (_, id) => messageRequest({ id })));
  assert.equal(tooMany.status, 413);
});
