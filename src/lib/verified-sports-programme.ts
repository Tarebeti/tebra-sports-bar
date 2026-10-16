import programme from "../../public/sports-programme.json";
import type { VerifiedFixture } from "./sports-fixtures";

// Build-time fallback uses the same source-cited programme as the live feed.
// The browser refreshes it independently of site publishing.
export const VERIFIED_SPORTS_PROGRAMME: readonly VerifiedFixture[] = programme.events.map(event => ({
  id: event.id,
  title: event.title,
  sport: event.sport || "Sport",
  competition: event.competition,
  startsAt: event.start,
  sourceUrl: event.source,
  sourceName: "Official source",
  verifiedAt: `${event.verified}T00:00:00Z`,
  priority: event.priority,
  featured: event.featured,
}));
