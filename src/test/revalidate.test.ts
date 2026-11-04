// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";
import { encodeSignatureHeader, SIGNATURE_HEADER_NAME } from "@sanity/webhook";
import handler from "../../api/revalidate";

const cache = vi.hoisted(() => ({ expireTag: vi.fn(async () => undefined) }));
vi.mock("@vercel/functions", () => ({ getCache: () => cache }));
const secret = "test-secret-with-at-least-32-characters";

async function request(body: string, signingSecret = secret): Promise<Request> {
  const signature = await encodeSignatureHeader(body, Date.now(), signingSecret);
  return new Request("https://example.com/api/revalidate", { method: "POST", headers: { [SIGNATURE_HEADER_NAME]: signature }, body });
}

afterEach(() => { delete process.env.SANITY_WEBHOOK_SECRET; cache.expireTag.mockClear(); });

describe("Sanity webhook", () => {
  it("rejects an unconfigured secret, missing signature, and a mismatched signature", async () => {
    expect((await handler.fetch(new Request("https://example.com/api/revalidate", { method: "POST", body: "{}" }))).status).toBe(503);
    process.env.SANITY_WEBHOOK_SECRET = secret;
    expect((await handler.fetch(new Request("https://example.com/api/revalidate", { method: "POST", body: "{}" }))).status).toBe(401);
    expect((await handler.fetch(await request('{"_type":"post","_id":"post-1"}', "wrong-secret-with-at-least-32-characters"))).status).toBe(401);
    expect(cache.expireTag).not.toHaveBeenCalled();
  });

  it("rejects signed draft and unsupported events", async () => {
    process.env.SANITY_WEBHOOK_SECRET = secret;
    expect((await handler.fetch(await request('{"_type":"post","_id":"drafts.post-1"}'))).status).toBe(400);
    expect((await handler.fetch(await request('{"_type":"other","_id":"id"}'))).status).toBe(400);
    expect(cache.expireTag).not.toHaveBeenCalled();
  });

  it("rejects a payload changed after signing", async () => {
    process.env.SANITY_WEBHOOK_SECRET = secret;
    const original = '{"_type":"post","_id":"post-1"}';
    const signature = await encodeSignatureHeader(original, Date.now(), secret);
    const tampered = new Request("https://example.com/api/revalidate", {
      method: "POST", headers: { [SIGNATURE_HEADER_NAME]: signature }, body: '{"_type":"post","_id":"post-2"}',
    });
    expect((await handler.fetch(tampered)).status).toBe(401);
    expect(cache.expireTag).not.toHaveBeenCalled();
  });

  it("expires the appropriate tag only after authenticating the exact raw body", async () => {
    process.env.SANITY_WEBHOOK_SECRET = secret;
    const response = await handler.fetch(await request('{ "_type": "service", "_id": "service-1" }'));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ revalidated: true, tag: "sanity:service" });
    expect(cache.expireTag).toHaveBeenCalledExactlyOnceWith("sanity:service");
  }, 10000);
});
