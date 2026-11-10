import { describe, expect, it } from "vitest";
import { mergeSecurityHeaders, securityHeadersRecord } from "@/lib/server/securityHeaders";

describe("securityHeaders", () => {
  it("includes HSTS, nosniff, frame deny, and referrer policy", () => {
    const headers = securityHeadersRecord();
    expect(headers["Strict-Transport-Security"]).toContain("max-age=");
    expect(headers["X-Content-Type-Options"]).toBe("nosniff");
    expect(headers["X-Frame-Options"]).toBe("DENY");
    expect(headers["Referrer-Policy"]).toBe("strict-origin-when-cross-origin");
  });

  it("merges without dropping route-specific headers", () => {
    const merged = mergeSecurityHeaders({
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    });
    expect(merged["Content-Type"]).toContain("text/html");
    expect(merged["X-Frame-Options"]).toBe("DENY");
  });
});
