export type ServiceCity = {
  slug: string;
  name: string;
  region?: string;
};

export type ServiceMarket = {
  id: string;
  name: string;
  shortName: string;
  cities: ServiceCity[];
};

/**
 * Major metros we work with for AI automation, voice agents, websites,
 * mobile apps, and custom software. Head office is Albuquerque; secondary
 * office is Lahore. Other cities are markets served, not extra local offices.
 */
export const SERVICE_MARKETS: ServiceMarket[] = [
  {
    id: "usa",
    name: "United States",
    shortName: "USA",
    cities: [
      { slug: "new-york", name: "New York", region: "NY" },
      { slug: "los-angeles", name: "Los Angeles", region: "CA" },
      { slug: "san-francisco", name: "San Francisco", region: "CA" },
      { slug: "san-jose", name: "San Jose", region: "CA" },
      { slug: "chicago", name: "Chicago", region: "IL" },
      { slug: "houston", name: "Houston", region: "TX" },
      { slug: "dallas", name: "Dallas", region: "TX" },
      { slug: "austin", name: "Austin", region: "TX" },
      { slug: "miami", name: "Miami", region: "FL" },
      { slug: "atlanta", name: "Atlanta", region: "GA" },
      { slug: "seattle", name: "Seattle", region: "WA" },
      { slug: "boston", name: "Boston", region: "MA" },
      { slug: "washington-dc", name: "Washington", region: "DC" },
      { slug: "denver", name: "Denver", region: "CO" },
      { slug: "phoenix", name: "Phoenix", region: "AZ" },
      { slug: "philadelphia", name: "Philadelphia", region: "PA" },
      { slug: "san-diego", name: "San Diego", region: "CA" },
      { slug: "tampa", name: "Tampa", region: "FL" },
      { slug: "charlotte", name: "Charlotte", region: "NC" },
      { slug: "nashville", name: "Nashville", region: "TN" },
      { slug: "las-vegas", name: "Las Vegas", region: "NV" },
      { slug: "orlando", name: "Orlando", region: "FL" },
    ],
  },
  {
    id: "uk",
    name: "United Kingdom",
    shortName: "UK",
    cities: [
      { slug: "london", name: "London" },
      { slug: "manchester", name: "Manchester" },
      { slug: "birmingham", name: "Birmingham" },
      { slug: "leeds", name: "Leeds" },
      { slug: "edinburgh", name: "Edinburgh" },
      { slug: "glasgow", name: "Glasgow" },
      { slug: "bristol", name: "Bristol" },
      { slug: "liverpool", name: "Liverpool" },
      { slug: "cambridge", name: "Cambridge" },
      { slug: "reading", name: "Reading" },
      { slug: "belfast", name: "Belfast" },
      { slug: "cardiff", name: "Cardiff" },
    ],
  },
  {
    id: "uae",
    name: "United Arab Emirates",
    shortName: "UAE",
    cities: [
      { slug: "dubai", name: "Dubai" },
      { slug: "abu-dhabi", name: "Abu Dhabi" },
      { slug: "sharjah", name: "Sharjah" },
      { slug: "ajman", name: "Ajman" },
      { slug: "ras-al-khaimah", name: "Ras Al Khaimah" },
    ],
  },
];
