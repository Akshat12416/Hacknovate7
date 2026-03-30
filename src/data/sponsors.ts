export interface Sponsor {
  name: string;
  logo: string;
  alt: string;
}

export interface SponsorCategory {
  title: string;
  tier: "venue" | "powered" | "gold" | "silver" | "bronze" | "promo" | "food" | "platform" | "beverage" | "general" | "organized";
  sponsors: Sponsor[];
}

export const SPONSOR_CATEGORIES: SponsorCategory[] = [
  {
    title: "Powered By",
    tier: "powered",
    sponsors: [
      { name: "GENESIS", logo: "/assets/sponsors/genesis.png", alt: "Genesis - Powered By" },
    ],
  },
  {
    title: "Gold Sponsor",
    tier: "gold",
    sponsors: [
      { name: "MOTHER HOMES", logo: "/assets/sponsors/motherhomes-pg.png", alt: "Mother Homes - Gold Sponsor" },
      { name: "UP2SKILL", logo: "/assets/sponsors/UptoSkills_Full_transparent 2.png", alt: "UP2SKILL - Gold Sponsor" },
      { name: "ALLIANCE DIARY", logo: "/assets/sponsors/allianz_clean_final 2.png", alt: "Alliance Diary - Gold Sponsor" },
    ],
  },
  {
    title: "Silver Sponsor",
    tier: "silver",
    sponsors: [
      { name: "ALGORAND", logo: "/assets/sponsors/algorand-logo-white-CMYK 2.png", alt: "Algorand - Silver Sponsor" },
    ],
  },
  {
    title: "Bronze Sponsor",
    tier: "bronze",
    sponsors: [
      { name: "DUALITY", logo: "/assets/sponsors/duality.png", alt: "Duality - Bronze Sponsor" },
      { name: "MASTRA AI", logo: "/assets/sponsors/mastra.png", alt: "Mastra AI - Bronze Sponsor" },
    ],
  },
  {
    title: "Promotional Partner",
    tier: "promo",
    sponsors: [
      { name: "MULTIATOMS", logo: "/assets/sponsors/multi atoms.png", alt: "Multi Atoms - Promotional Partner" },
    ],
  },
  {
    title: "Food Partner",
    tier: "food",
    sponsors: [
      { name: "STREET CHAI WALA", logo: "/assets/sponsors/street chai.png", alt: "Street Chai Wala - Food Partner" },
    ],
  },
  {
    title: "Platform Partner",
    tier: "platform",
    sponsors: [
      { name: "DEVFOLIO", logo: "/assets/sponsors/devfolio.png", alt: "Devfolio - Platform Partner" },
    ],
  },
  // {
  //   title: "Beverage Partner",
  //   tier: "beverage",
  //   sponsors: [
  //     { name: "FRUITCHILL", logo: "/assets/sponsors/fruitchill.png", alt: "Fruitchill - Beverage Partner" },
  //   ],
  // },
  {
    title: "General Sponsor",
    tier: "general",
    sponsors: [
      { name: "TNIGLY", logo: "/assets/sponsors/Tingly Sticker 2.png", alt: "Tnigly - General Sponsor" },
      { name: ".XYZ", logo: "/assets/sponsors/xyz.png", alt: ".XYZ - General Sponsor" },
    ],
  },
  {
    title: "Organized By",
    tier: "organized",
    sponsors: [
      { name: "ABESIT", logo: "/assets/sponsors/Abesit logo- white.png", alt: "ABESIT - Organized By" },
    ],
  },
];
