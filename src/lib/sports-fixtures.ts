export type VerifiedFixture = {
  id: string;
  title: string;
  sport: string;
  competition: string;
  startsAt: string;
  sourceUrl: string;
  sourceName: string;
  verifiedAt: string;
  priority?: number;
  featured?: boolean;
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

/** Fixtures with verification evidence that have not finished, best first. */
export function eligibleFixtures(fixtures: readonly VerifiedFixture[], now: Date) {
  // Retain starts for three hours; a schedule never implies a confirmed screening.
  return fixtures.filter((fixture) => {
    const start = Date.parse(fixture.startsAt);
    const verification = Date.parse(fixture.verifiedAt);
    return Number.isFinite(start) && Number.isFinite(verification)
      && verification <= now.getTime()
      && /^https:\/\//.test(fixture.sourceUrl)
      && fixture.sourceName.trim().length > 0
      && start + 3 * 60 * 60 * 1000 >= now.getTime();
  }).sort((a, b) => (a.priority ?? 2) - (b.priority ?? 2)
    || Number(!!b.featured) - Number(!!a.featured)
    || Date.parse(a.startsAt) - Date.parse(b.startsAt));
}

export function selectFixtures(fixtures: readonly VerifiedFixture[], now: Date) {
  const upcoming = eligibleFixtures(fixtures, now);
  const today = greekDate(now);
  return {
    today: upcoming.filter((fixture) => greekDate(new Date(fixture.startsAt)) === today).slice(0, 4),
    upcoming: upcoming.filter((fixture) => greekDate(new Date(fixture.startsAt)) !== today).slice(0, 4),
  };
}

/** Premier League stands alone; every other European football competition is grouped together. */
export type FixtureGroup = "premier" | "europe" | "more";
const NON_EUROPEAN_FOOTBALL = new Set(["Brazil Serie A", "MLS", "Copa Libertadores"]);

export function fixtureGroup(fixture: Pick<VerifiedFixture, "sport" | "competition">): FixtureGroup {
  if (fixture.competition === "Premier League") return "premier";
  if (fixture.sport === "Football" && !NON_EUROPEAN_FOOTBALL.has(fixture.competition)) return "europe";
  return "more";
}

/** Best fixtures per group for today or the coming week, shown in kick-off order. */
export function groupFixtures(fixtures: readonly VerifiedFixture[], now: Date, period: "today" | "week", limit = 3) {
  const today = greekDate(now);
  const pool = eligibleFixtures(fixtures, now)
    .filter((fixture) => period === "week" || greekDate(new Date(fixture.startsAt)) === today);
  const pick = (group: FixtureGroup) => pool.filter((fixture) => fixtureGroup(fixture) === group)
    .slice(0, limit)
    .sort((a, b) => Date.parse(a.startsAt) - Date.parse(b.startsAt));
  return { premier: pick("premier"), europe: pick("europe"), more: pick("more") };
}

/** Feed titles use spaced dashes ("GP — Race"); visible copy avoids dashes. */
export function displayTitle(title: string): string {
  return title.replace(/\s+[—–-]\s+/g, ": ");
}