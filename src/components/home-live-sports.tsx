import { ArrowUpRight, CalendarDays, Clock3, Tv } from "lucide-react";
import { useEffect, useState } from "react";
import { loadProgramme } from "@/lib/programme-feed";
import { fixtureDate, greekTime, selectFixtures, type VerifiedFixture } from "@/lib/sports-fixtures";

type Props = {
  fixtures: readonly VerifiedFixture[];
  requestUrl: (message: string) => string;
};

export function HomeLiveSports({ fixtures, requestUrl }: Props) {
  const [period, setPeriod] = useState<"today" | "week">("today");
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(timer);
  }, []);
  const [checked, setChecked] = useState<string | null>(null);
  const [remoteFixtures, setRemoteFixtures] = useState<readonly VerifiedFixture[] | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    const refresh = () => loadProgramme(controller.signal).then(feed => {
      setChecked(feed.checked);
      setRemoteFixtures(feed.events.map(event => ({
        id: event.id, title: event.title, sport: event.sport || "Sport",
        competition: event.competition, startsAt: event.start,
        sourceUrl: event.source, sourceName: "Official source",
        verifiedAt: event.verified + "T00:00:00Z",
        priority: event.priority, featured: event.featured,
      })));
    }).catch(() => { /* Preserve the last successfully loaded programme. */ });
    refresh();
    const timer = setInterval(refresh, 300_000);
    return () => { controller.abort(); clearInterval(timer); };
  }, []);
  const selected = now ? selectFixtures(remoteFixtures ?? fixtures, now) : { today: [], upcoming: [] };

  const showToday = period === "today" && selected.today.length > 0;
  const shown = showToday ? selected.today : [...selected.today, ...selected.upcoming];

  return (
    <section id="live-sports" aria-labelledby="live-sports-title" className="home-sports">
      <div className="home-wrap">
        <div className="home-sports-heading home-match-hero">
          <div>
            <p className="label-eyebrow"><Tv size={16} aria-hidden="true" /> LIVE SPORT · HERSONISSOS, CRETE</p>
            <h1 id="live-sports-title">Your match.<br /><span>Your place.</span></h1>
          </div>
          <div className="home-sports-intro"><p>Find your match. Check the Greek time.<br />Make it a Tebra evening.</p><a href="/sports-desk" className="home-text-link">Full programme <ArrowUpRight size={18} aria-hidden="true" /></a></div>
        </div>
        <div className="home-programme-tools">
          <div className="home-programme-periods" role="group" aria-label="Programme period">
            <button type="button" aria-pressed={period === "today"} onClick={() => setPeriod("today")}>Today</button>
            <button type="button" aria-pressed={period === "week"} onClick={() => setPeriod("week")}>This week</button>
          </div>
          <span className="home-greek-time"><Clock3 size={16} aria-hidden="true" /> All times in Greece</span>
        </div>
        {!now ? <p className="home-programme-empty" role="status">Checking the programme…</p> : shown.length ? <ul className="home-fixture-grid">
          {shown.map(fixture => <li key={fixture.id} className="home-fixture">
            <div className="home-fixture-top"><p>{fixture.competition}</p><time dateTime={fixture.startsAt}>{greekTime(fixture.startsAt)}</time></div>
            <h2>{fixture.title}</h2>
            <p className="home-fixture-date"><CalendarDays size={14} aria-hidden="true" /> {fixtureDate(fixture.startsAt)}</p>
            <div className="home-fixture-actions"><a href={requestUrl(`Hi Tebra, I would like to request a table for ${fixture.title} on ${fixtureDate(fixture.startsAt)} at ${greekTime(fixture.startsAt)} Greek time. Please confirm the screening and table availability.`)} target="_blank" rel="noopener noreferrer" className="home-fixture-request" aria-label={`Request a table for ${fixture.title}`}>Request a table <ArrowUpRight size={15} aria-hidden="true" /></a><a href={fixture.sourceUrl} target="_blank" rel="noopener noreferrer" aria-label={`Official schedule source for ${fixture.title}`} className="home-fixture-source">Source</a></div>
          </li>)}
        </ul> : <p className="home-programme-empty">No upcoming fixtures listed. Ask us about your match.</p>}
        {now && !showToday && period === "today" && selected.upcoming.length > 0 && <p className="home-programme-note">Today’s listed start times have passed. Here is what’s coming up.</p>}
        <div className="home-programme-footer"><p>{checked ? `Schedule checked ${checked}. ` : ""}Contact Tebra to confirm your screening and table.</p><a href="/sports-desk" className="home-text-link">All sports &amp; fixtures <ArrowUpRight size={16} aria-hidden="true" /></a></div>
      </div>
    </section>
  );
}

