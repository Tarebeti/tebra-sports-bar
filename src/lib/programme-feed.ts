export const PROGRAMME_URL = "https://raw.githubusercontent.com/Tarebeti/tebra-sports-bar/main/public/sports-programme.json";
export type ProgrammeEvent = { id: string; title: string; start: string; competition: string; sport?: string; featured?: boolean; verified: string; source: string };
export type ProgrammeFeed = { timezone: string; checked: string; events: ProgrammeEvent[] };
export async function loadProgramme(signal?: AbortSignal): Promise<ProgrammeFeed> {
  const response = await fetch(`${PROGRAMME_URL}?v=${Math.floor(Date.now() / 300000)}`, { signal });
  if (!response.ok) throw new Error("Programme unavailable");
  const feed = await response.json();
  if (feed.timezone !== "Europe/Athens" || !/^\d{4}-\d{2}-\d{2}$/.test(feed.checked) || !Array.isArray(feed.events)) throw new Error("Invalid programme");
  if (feed.events.length > 1000 || feed.events.some((e: ProgrammeEvent) => typeof e.id !== "string" || typeof e.title !== "string" || typeof e.competition !== "string" || !Number.isFinite(Date.parse(e.start)) || !/^\d{4}-\d{2}-\d{2}$/.test(e.verified) || !/^https:\/\//.test(e.source))) throw new Error("Invalid event");
  return feed;
}
