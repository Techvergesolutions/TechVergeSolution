import raw from "./homepage-content.json";

export type HomepageFaq = { question: string; answer: string };

export const HOMEPAGE_ABOUT = {
  eyebrow: raw.aboutEyebrow,
  heading: raw.aboutHeading,
  paragraphs: raw.aboutParagraphs as string[],
};

export const HOMEPAGE_FAQ: HomepageFaq[] = raw.faqs;
