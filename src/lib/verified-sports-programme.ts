import type { VerifiedFixture } from "./sports-fixtures";

// Checked against the official pages on 9 October 2026. This is a curated
// programme, not an automatic feed. New fixtures must be reverified before
// adding them. Previously started events are hidden by selectFixtures.
const verifiedAt = "2026-10-09T06:45:00Z";
const premierLeague = "https://www.premierleague.com/en/news/4688862/fixture-amendments-for-premier-league-matches-in-october-and-november";
const rugby = "https://springboks.rugby/match-centre/fixtures";

export const VERIFIED_SPORTS_PROGRAMME: readonly VerifiedFixture[] = [
  {
    id: "singapore-sprint-qualifying-2026",
    title: "Singapore Grand Prix · Sprint qualifying",
    sport: "Motorsport", competition: "Formula 1",
    startsAt: "2026-10-09T12:30:00Z",
    sourceUrl: "https://www.formula1.com/en/racing/2026/singapore",
    sourceName: "Formula 1", verifiedAt,
  },
  {
    id: "dragons-ospreys-20261009",
    title: "Dragons vs Ospreys",
    sport: "Rugby", competition: "United Rugby Championship",
    // Official SA Rugby SportsEvent JSON-LD: 2026-10-09T18:45:00Z.
    // Displayed 20:45 is SAST, not venue-local BST.
    startsAt: "2026-10-09T18:45:00Z",
    sourceUrl: rugby, sourceName: "SA Rugby", verifiedAt,
  },
  {
    id: "glasgow-connacht-20261009",
    title: "Glasgow vs Connacht",
    sport: "Rugby", competition: "United Rugby Championship",
    startsAt: "2026-10-09T18:45:00Z",
    sourceUrl: rugby, sourceName: "SA Rugby", verifiedAt,
  },
  {
    id: "arsenal-leeds-20261010",
    title: "Arsenal vs Leeds",
    sport: "Football", competition: "Premier League",
    // Official revised schedule: Saturday 10 October, 12:30 BST.
    startsAt: "2026-10-10T11:30:00Z",
    sourceUrl: premierLeague, sourceName: "Premier League", verifiedAt,
  },
  {
    id: "manutd-spurs-20261010",
    title: "Manchester United vs Tottenham",
    sport: "Football", competition: "Premier League",
    // Official revised schedule: Saturday 10 October, 17:30 BST.
    startsAt: "2026-10-10T16:30:00Z",
    sourceUrl: premierLeague, sourceName: "Premier League", verifiedAt,
  },
  {
    id: "liverpool-mancity-20261011",
    title: "Liverpool vs Manchester City",
    sport: "Football", competition: "Premier League",
    // Official revised schedule: Sunday 11 October, 16:30 BST.
    startsAt: "2026-10-11T15:30:00Z",
    sourceUrl: premierLeague, sourceName: "Premier League", verifiedAt,
  },
];