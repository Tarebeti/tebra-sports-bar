import type { VerifiedFixture } from "./sports-fixtures";

// Checked against the official pages on 9 October 2026. This is a curated
// programme, not an automatic feed. New fixtures must be reverified before
// adding them. Previously started events are hidden by selectFixtures.
const verifiedAt = "2026-10-09T06:45:00Z";
const premierLeague = "https://www.premierleague.com/en/news/4688862/fixture-amendments-for-premier-league-matches-in-october-and-november";
const rugby = "https://springboks.rugby/match-centre/fixtures";

export const VERIFIED_SPORTS_PROGRAMME: readonly VerifiedFixture[] = [
{
  "id": "lask-liverpool-20261014",
  "title": "LASK vs Liverpool",
  "sport": "Football",
  "competition": "UEFA Champions League",
  "startsAt": "2026-10-14T16:45:00Z",
  "sourceUrl": "https://www.uefa.com/uefachampionsleague/news/02a8-2176fa83582b-d99f0b27f405-1000--champions-league-league-phase-fixtures-by-team/",
  "sourceName": "UEFA",
  "verifiedAt": "2026-10-14T18:43:00Z"
},
{
  "id": "city-psg-20261014",
  "title": "Manchester City vs Paris Saint-Germain",
  "sport": "Football",
  "competition": "UEFA Champions League",
  "startsAt": "2026-10-14T19:00:00Z",
  "sourceUrl": "https://www.uefa.com/uefachampionsleague/news/02a8-2176fa83582b-d99f0b27f405-1000--champions-league-league-phase-fixtures-by-team/",
  "sourceName": "UEFA",
  "verifiedAt": "2026-10-14T18:43:00Z"
},
{
  "id": "villa-fenerbahce-20261014",
  "title": "Aston Villa vs Fenerbahçe",
  "sport": "Football",
  "competition": "UEFA Champions League",
  "startsAt": "2026-10-14T19:00:00Z",
  "sourceUrl": "https://www.uefa.com/uefachampionsleague/news/02a8-2176fa83582b-d99f0b27f405-1000--champions-league-league-phase-fixtures-by-team/",
  "sourceName": "UEFA",
  "verifiedAt": "2026-10-14T18:43:00Z"
},
{
  "id": "bodo-dortmund-20261014",
  "title": "Bodø/Glimt vs Borussia Dortmund",
  "sport": "Football",
  "competition": "UEFA Champions League",
  "startsAt": "2026-10-14T19:00:00Z",
  "sourceUrl": "https://www.uefa.com/uefachampionsleague/news/02a8-2176fa83582b-d99f0b27f405-1000--champions-league-league-phase-fixtures-by-team/",
  "sourceName": "UEFA",
  "verifiedAt": "2026-10-14T18:43:00Z"
},
{
  "id": "roma-madrid-20261014",
  "title": "Roma vs Real Madrid",
  "sport": "Football",
  "competition": "UEFA Champions League",
  "startsAt": "2026-10-14T19:00:00Z",
  "sourceUrl": "https://www.uefa.com/uefachampionsleague/news/02a8-2176fa83582b-d99f0b27f405-1000--champions-league-league-phase-fixtures-by-team/",
  "sourceName": "UEFA",
  "verifiedAt": "2026-10-14T18:43:00Z"
},
{
  "id": "liverpool-villarreal-20261020",
  "title": "Liverpool vs Villarreal",
  "sport": "Football",
  "competition": "UEFA Champions League",
  "startsAt": "2026-10-20T19:00:00Z",
  "sourceUrl": "https://www.uefa.com/uefachampionsleague/news/02a8-2176fa83582b-d99f0b27f405-1000--champions-league-league-phase-fixtures-by-team/",
  "sourceName": "UEFA",
  "verifiedAt": "2026-10-14T18:43:00Z"
},
{
  "id": "city-aek-20261020",
  "title": "Manchester City vs AEK Athens",
  "sport": "Football",
  "competition": "UEFA Champions League",
  "startsAt": "2026-10-20T19:00:00Z",
  "sourceUrl": "https://www.uefa.com/uefachampionsleague/news/02a8-2176fa83582b-d99f0b27f405-1000--champions-league-league-phase-fixtures-by-team/",
  "sourceName": "UEFA",
  "verifiedAt": "2026-10-14T18:43:00Z"
},
{
  "id": "psg-barcelona-20261020",
  "title": "Paris Saint-Germain vs Barcelona",
  "sport": "Football",
  "competition": "UEFA Champions League",
  "startsAt": "2026-10-20T19:00:00Z",
  "sourceUrl": "https://www.uefa.com/uefachampionsleague/news/02a8-2176fa83582b-d99f0b27f405-1000--champions-league-league-phase-fixtures-by-team/",
  "sourceName": "UEFA",
  "verifiedAt": "2026-10-14T18:43:00Z"
},
{
  "id": "bayern-arsenal-20261021",
  "title": "Bayern München vs Arsenal",
  "sport": "Football",
  "competition": "UEFA Champions League",
  "startsAt": "2026-10-21T19:00:00Z",
  "sourceUrl": "https://www.uefa.com/uefachampionsleague/news/02a8-2176fa83582b-d99f0b27f405-1000--champions-league-league-phase-fixtures-by-team/",
  "sourceName": "UEFA",
  "verifiedAt": "2026-10-14T18:43:00Z"
},
{
  "id": "como-united-20261021",
  "title": "Como vs Manchester United",
  "sport": "Football",
  "competition": "UEFA Champions League",
  "startsAt": "2026-10-21T16:45:00Z",
  "sourceUrl": "https://www.uefa.com/uefachampionsleague/news/02a8-2176fa83582b-d99f0b27f405-1000--champions-league-league-phase-fixtures-by-team/",
  "sourceName": "UEFA",
  "verifiedAt": "2026-10-14T18:43:00Z"
},
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
  {
    id: "coventry-newcastle-20261012",
    title: "Coventry City vs Newcastle",
    sport: "Football", competition: "Premier League",
    startsAt: "2026-10-12T19:00:00Z",
    sourceUrl: premierLeague, sourceName: "Premier League",
    verifiedAt: "2026-10-11T22:10:00Z",
  },
  {
    id: "everton-chelsea-20261017",
    title: "Everton vs Chelsea",
    sport: "Football", competition: "Premier League",
    startsAt: "2026-10-17T11:30:00Z",
    sourceUrl: premierLeague, sourceName: "Premier League",
    verifiedAt: "2026-10-11T22:10:00Z",
  },
  {
    id: "newcastle-villa-20261017",
    title: "Newcastle vs Aston Villa",
    sport: "Football", competition: "Premier League",
    startsAt: "2026-10-17T16:30:00Z",
    sourceUrl: premierLeague, sourceName: "Premier League",
    verifiedAt: "2026-10-11T22:10:00Z",
  },
];