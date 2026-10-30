import { describe, expect, it } from "vitest";
import {
  extractUtmParams,
  stripUtmFromSearch,
  utmSafePagePath,
} from "@/lib/analytics";

describe("UTM-safe helpers", () => {
  it("extracts campaign params", () => {
    expect(
      extractUtmParams(
        "?utm_source=linkedin&utm_medium=social&utm_campaign=spring&intent=strategy",
      ),
    ).toEqual({
      utm_source: "linkedin",
      utm_medium: "social",
      utm_campaign: "spring",
    });
  });

  it("strips UTMs but keeps other query params", () => {
    expect(
      stripUtmFromSearch("?utm_source=x&intent=audit&utm_medium=cpc"),
    ).toBe("?intent=audit");
  });

  it("builds a UTM-safe page path", () => {
    expect(
      utmSafePagePath("/contact", "?utm_source=ad&intent=strategy"),
    ).toBe("/contact?intent=strategy");
  });
});
