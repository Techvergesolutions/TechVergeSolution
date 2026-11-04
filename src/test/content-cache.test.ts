// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";
import { CONTENT_TAGS, getPublishedContent } from "@/lib/server/content";

const state = vi.hoisted(() => ({
  documents: [{ _id: "post-1", _type: "post", slug: "example" }],
  fetch: vi.fn(), get: vi.fn(), set: vi.fn(),
}));
vi.mock("@sanity/client", () => ({ createClient: () => ({ fetch: state.fetch }) }));
vi.mock("@vercel/functions", () => ({ getCache: () => ({ get: state.get, set: state.set }) }));

afterEach(() => { vi.unstubAllEnvs(); vi.resetAllMocks(); });

describe("tagged content cache", () => {
  it("tags a published Sanity snapshot so the webhook can invalidate it", async () => {
    vi.stubEnv("VERCEL", "1");
    vi.stubEnv("SANITY_PROJECT_ID", "test-project");
    state.get.mockResolvedValue(null);
    state.fetch.mockResolvedValue(state.documents);
    state.set.mockResolvedValue(undefined);
    expect(await getPublishedContent()).toEqual(state.documents);
    expect(state.set).toHaveBeenCalledWith(expect.stringContaining("content-index-v2:"), state.documents, { ttl: 300, tags: [...CONTENT_TAGS] });
  });

  it("uses a cache hit without fetching Sanity again", async () => {
    vi.stubEnv("VERCEL", "1");
    vi.stubEnv("SANITY_PROJECT_ID", "test-project");
    state.get.mockResolvedValue(state.documents);
    expect(await getPublishedContent()).toEqual(state.documents);
    expect(state.fetch).not.toHaveBeenCalled();
  });
});
