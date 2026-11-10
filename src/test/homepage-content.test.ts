import { describe, expect, it } from "vitest";
import { HOMEPAGE_ABOUT, HOMEPAGE_FAQ } from "@/data/homepageContent";

describe("homepage AI search content", () => {
  it("includes about copy and required FAQ questions", () => {
    expect(HOMEPAGE_ABOUT.paragraphs.length).toBeGreaterThanOrEqual(2);
    const questions = HOMEPAGE_FAQ.map((f) => f.question);
    expect(questions).toContain("What services does Tech Verge Solution offer?");
    expect(questions).toContain("Where is Tech Verge Solution located?");
  });

  it("mentions Lahore and core services in answers", () => {
    const location = HOMEPAGE_FAQ.find((f) =>
      /located/i.test(f.question),
    )?.answer;
    const services = HOMEPAGE_FAQ.find((f) =>
      /services does/i.test(f.question),
    )?.answer;
    expect(location).toMatch(/Lahore/i);
    expect(services).toMatch(/voice agents/i);
    expect(services).toMatch(/automation/i);
  });
});
