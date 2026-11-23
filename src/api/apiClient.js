// Centralised HTTP layer (Checkpoint rule 1): no component calls fetch directly.
//
// One factory, two instances:
//   apiClient  -> our own Express API. { data } envelope, cookies + auth header.
//   feedClient -> third-party product feed (DummyJSON). Raw JSON, and it NEVER
//                 receives our cookies or auth token.
// Each instance has its own rate cap, GET cache, in-flight dedupe and 429 retry.

import { FEED_BASE_URL } from "../config/feed.js";

export class ApiError extends Error {
  constructor(status, code, message, fields) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.fields = fields;
  }
}

let authToken = null;
export const setAuthToken = (token) => { authToken = token; };

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function createClient({
  baseUrl,
  envelope,          // true: expect { data } / { error } contract
  internal,          // true: send credentials + auth header
  maxCallsPerMinute = 50,
  cacheTtlMs = 10_000,
  maxRetries = 2,
}) {
  const callTimes = [];
  const cache = new Map();    // path -> { at, data }
  const inFlight = new Map(); // path -> Promise

  async function waitForSlot() {
    for (;;) {
      const now = Date.now();
      while (callTimes.length && now - callTimes[0] > 60_000) callTimes.shift();
      if (callTimes.length < maxCallsPerMinute) {
        callTimes.push(now);
        return;
      }
      await sleep(60_000 - (now - callTimes[0]) + 50);
    }
  }

  async function send(method, path, body, attempt = 0) {
    await waitForSlot();

    let res;
    try {
      res = await fetch(`${baseUrl}${path}`, {
        method,
        credentials: internal ? "include" : "omit",
        headers: {
          Accept: "application/json",
          ...(body ? { "Content-Type": "application/json" } : {}),
          ...(internal && authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
        body: body ? JSON.stringify(body) : undefined,
      });
    } catch {
      throw new ApiError(0, "NETWORK_ERROR", "Network request failed. Check your connection and try again.");
    }

    if (res.status === 429 && attempt < maxRetries) {
      const wait = Number(res.headers.get("Retry-After") || 2) * 1000;
      await sleep(wait);
      return send(method, path, body, attempt + 1);
    }

    let payload;
    try { payload = await res.json(); } catch { payload = null; }

    if (!res.ok) {
      const e = envelope ? payload?.error : null;
      throw new ApiError(
        res.status,
        e?.code ?? "HTTP_ERROR",
        e?.message ?? payload?.message ?? "Something went wrong.",
        e?.fields
      );
    }

    // Validate shape, not just status (Checkpoint rule 3).
    if (envelope) {
      if (!payload || typeof payload !== "object" || !("data" in payload)) {
        throw new ApiError(res.status, "BAD_PAYLOAD", "The server sent an unexpected response.");
      }
      return payload.data;
    }
    if (!payload || typeof payload !== "object") {
      throw new ApiError(res.status, "BAD_PAYLOAD", "The server sent an unexpected response.");
    }
    return payload;
  }

  async function get(path, { fresh = false } = {}) {
    const hit = cache.get(path);
    if (!fresh && hit && Date.now() - hit.at < cacheTtlMs) return hit.data;
    if (inFlight.has(path)) return inFlight.get(path);

    const p = send("GET", path)
      .then((data) => { cache.set(path, { at: Date.now(), data }); return data; })
      .finally(() => inFlight.delete(path));
    inFlight.set(path, p);
    return p;
  }

  // Writes bypass the cache and clear it so reads never go stale.
  const write = (method) => (path, body) => {
    cache.clear();
    return send(method, path, body);
  };

  return { get, post: write("POST"), patch: write("PATCH"), delete: write("DELETE") };
}

export const apiClient = createClient({ baseUrl: "/api", envelope: true, internal: true });

// Read-only on purpose: the feed is a third party we never write to.
const feed = createClient({ baseUrl: FEED_BASE_URL, envelope: false, internal: false, maxCallsPerMinute: 30 });
export const feedClient = { get: feed.get };
