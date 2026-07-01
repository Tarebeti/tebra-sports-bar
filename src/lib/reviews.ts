// TE.BRA reviews data.
// TODO: swap seed for Google Places API "Place Details" call returning
// { rating, user_ratings_total, reviews: [{ author_name, rating, text, time }] }.
// Or replace getReviews() with a Featurable / Elfsight widget mount.

export interface Review {
  name: string;
  rating: number;
  date: string; // ISO YYYY-MM-DD
  title: string;
  snippet: string;
}

export interface ReviewSummary {
  rating: number;
  total: number;
  source: string;
  tripadvisorUrl: string;
  badges: string[];
}

export const REVIEW_SUMMARY: ReviewSummary = {
  rating: 5.0,
  total: 86,
  source: "Tripadvisor",
  tripadvisorUrl:
    "https://www.tripadvisor.com/Attraction_Review-g503710-d33284920-Reviews-TE_BRA_Sports_Bar-Hersonissos_Crete.html",
  badges: ["Travelers' Choice 2026", "#1 Nightlife in Hersonissos", "5.0 rating"],
};

const SEED: Review[] = [
  { name: "Magdalena W", rating: 5, date: "2026-06-27",
    title: "Top bar",
    snippet: "You walk in a stranger and leave a friend. Zach always welcomes you with a smile." },
  { name: "Jeevan J", rating: 5, date: "2026-06-27",
    title: "Best place on the island",
    snippet: "Friendly atmosphere, every sport on the screens, pool and darts. Great for families and groups." },
  { name: "Jodie P", rating: 5, date: "2026-06-26",
    title: "Fantastic bar, exceptional service",
    snippet: "Zac and Valentina made us feel welcome from the moment we arrived. We came back every day." },
  { name: "Global13482215665", rating: 5, date: "2026-06-25",
    title: "Hidden gem, best bar in Hersonissos",
    snippet: "Beautifully decorated to a high standard, spotless, and the owner is one of the nicest guys you will meet." },
  { name: "Mitchell V", rating: 5, date: "2026-06-24",
    title: "A great experience",
    snippet: "Warm atmosphere, friendly bartender, and they serve breakfast too. Quality food and plenty of it." },
  { name: "Compass05437472743", rating: 5, date: "2026-05-20",
    title: "Best bar in Hersonissos",
    snippet: "Spotless, modern and stylish. Great music, huge TVs for the game, and fantastic cocktails." },
  { name: "Anne-Marie A", rating: 5, date: "2026-04-27",
    title: "Exceptional",
    snippet: "Class bar with no less than seven flat screens. The top spot for sports lovers." },
  { name: "John and Kate", rating: 5, date: "2026-04-22",
    title: "Amazing bar, go visit",
    snippet: "Beautifully furnished, very Scandi chic, high quality screens and incredible cocktails with generous measures." },
];

export function getReviews(): Review[] {
  return [...SEED].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getSummary(): ReviewSummary {
  return REVIEW_SUMMARY;
}
