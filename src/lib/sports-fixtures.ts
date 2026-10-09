export type VerifiedFixture = {
  id: string;
  title: string;
  sport: string;
  competition: string;
  startsAt: string;
  sourceUrl: string;
  sourceName: string;
  verifiedAt: string;
};

export const GREEK_TIME_ZONE = "Europe/Athens";

export function greekDate(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: GREEK_TIME_ZONE,
    year: "numeric", month: "2-digit", day: "2-digit",
  }).format(date);
}

export function greekTime(startsAt: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: GREEK_TIME_ZONE,
    hour: "2-digit", minute: "2-digit", hour12: false,
  }).format(new Date(startsAt));
}

export function fixtureDate(startsAt: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: GREEK_TIME_ZONE,
    weekday: "short", day: "numeric", month: "short",
  }).format(new Date(startsAt));
}

export function selectFixtures(fixtures: readonly VerifiedFixture[], now: Date) {
  // Starts only: never infer that a fixture is currently live or that Tebra
  // has confirmed a screening. Previously started fixtures are removed.
  const upcoming = fixtures.filter((fixture) => {
    const start = Date.parse(fixture.startsAt);
    const verification = Date.parse(fixture.verifiedAt);
    return Number.isFinite(start) && Number.isFinite(verification)
      && verification <= now.getTime()
      && /^https:\/\//.test(fixture.sourceUrl)
      && fixture.sourceName.trim().length > 0
      && start >= now.getTime();
  }).sort((a, b) => Date.parse(a.startsAt) - Date.parse(b.startsAt));
  const today = greekDate(now);
  return {
    today: upcoming.filter((fixture) => greekDate(new Date(fixture.startsAt)) === today).slice(0, 3),
    upcoming: upcoming.filter((fixture) => greekDate(new Date(fixture.startsAt)) !== today).slice(0, 3),
  };
}