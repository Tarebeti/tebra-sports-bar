import { describe, expect, test } from "bun:test";
import { greekTime, selectFixtures, type VerifiedFixture } from "./sports-fixtures";

const fixture: VerifiedFixture = {
  id: "test", title: "Test match", sport: "Football", competition: "Test competition",
  startsAt: "2026-10-09T18:00:00Z", sourceUrl: "https://www.uefa.com/", sourceName: "UEFA",
  verifiedAt: "2026-10-09T06:45:00Z",
};

describe("Greek fixture times", () => {
  test("shows Greek summer time rather than the visitor timezone", () => {
    expect(greekTime("2026-10-09T18:00:00Z")).toBe("21:00");
  });
  test("automatically uses Greek winter time after the clock change", () => {
    expect(greekTime("2026-10-26T18:00:00Z")).toBe("20:00");
  });
  test("groups today by the Greek calendar date at midnight", () => {
    const overnight = { ...fixture, startsAt: "2026-10-09T22:00:00Z" };
    expect(selectFixtures([overnight], new Date("2026-10-09T21:30:00Z")).today).toEqual([overnight]);
  });
});

describe("Verified fixtures only", () => {
  test("omits entries without verification evidence", () => {
    expect(selectFixtures([{ ...fixture, verifiedAt: "" }], new Date("2026-10-09T07:00:00Z")).today).toEqual([]);
  });
  test("omits entries without an official source link", () => {
    expect(selectFixtures([{ ...fixture, sourceUrl: "" }], new Date("2026-10-09T07:00:00Z")).today).toEqual([]);
  });
  test("does not label past starts as upcoming or assume they are live", () => {
    expect(selectFixtures([fixture], new Date("2026-10-09T19:00:00Z"))).toEqual({ today: [], upcoming: [] });
  });
  test("keeps future fixtures sorted after today's fixtures", () => {
    const next = { ...fixture, id: "next", startsAt: "2026-10-10T18:00:00Z" };
    expect(selectFixtures([next, fixture], new Date("2026-10-09T07:00:00Z"))).toEqual({ today: [fixture], upcoming: [next] });
  });
});