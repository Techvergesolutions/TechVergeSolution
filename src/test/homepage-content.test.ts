import { describe, expect, it } from "vitest";
import { HOMEPAGE_ABOUT, HOMEPAGE_FAQ } from "@/data/homepageContent";

describe("homepage AI search content", () => {
  it("includes about copy and required FAQ questions", () => {
    expect(HOMEPAGE_ABOUT.paragraphs.length).toBeGreaterThanOrEqual(2);
    const questions = HOMEPAGE_FAQ.map((f) => f.question);
    expect(questions).toContain("What services does TechVerge Solution offer?");
    expect(questions).toContain("Where is TechVerge Solution located?");
  });

  it("mentions Albuquerque head office, Lahore secondary office, and core services", () => {
    const location = HOMEPAGE_FAQ.find((f) =>
      /located/i.test(f.question),
    )?.answer;
    const services = HOMEPAGE_FAQ.find((f) =>
      /services does/i.test(f.question),
    )?.answer;
    expect(location).toMatch(/Albuquerque/i);
    expect(location).toMatch(/1209 Mountain Rd Pl NE #5036/i);
    expect(location).toMatch(/Lahore/i);
    expect(services).toMatch(/voice agents/i);
    expect(services).toMatch(/automation/i);
  });
});
