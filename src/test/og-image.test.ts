import { describe, expect, it, vi } from "vitest";
import sharp from "sharp";

vi.mock("@/lib/server/blogPage", () => ({
  fetchBlogHead: async (slug: string) => ({ post: slug === "example" ? { title: "A practical guide & checklist" } : null }),
}));

import handler from "../../api/og";

describe("article image endpoint", () => {
  it("renders a published post as a 1200 by 630 PNG", async () => {
    const response = await handler.fetch(new Request("https://example.com/api/og?slug=example"));
    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("image/png");
    expect(await sharp(Buffer.from(await response.arrayBuffer())).metadata()).toMatchObject({ format: "png", width: 1200, height: 630 });
  });

  it("rejects invalid slugs and unknown posts", async () => {
    expect((await handler.fetch(new Request("https://example.com/api/og?slug=a%2Fb"))).status).toBe(400);
    expect((await handler.fetch(new Request("https://example.com/api/og?slug=missing"))).status).toBe(404);
  });
});
