import { ArrowUpRight, CalendarDays, Clock3, Tv } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { loadProgramme } from "@/lib/programme-feed";
import { fixtureDate, greekTime, selectFixtures, type VerifiedFixture } from "@/lib/sports-fixtures";

type Props = {
  fixtures: readonly VerifiedFixture[];
  requestUrl: (message: string) => string;
};

const FEATURED_COMPETITIONS = [
  { name: "Premier League", group: "ENGLAND" },
  { name: "Champions League", group: "EUROPE" },
  { name: "Europa League", group: "EUROPE" },
];

const COUNTRY_LEAGUES = [
  { name: "England · Championship", country: "ENGLAND" },
  { name: "Spain · La Liga", country: "SPAIN" },
  { name: "Italy · Serie A", country: "ITALY" },
  { name: "Germany · Bundesliga", country: "GERMANY" },
  { name: "France · Ligue 1", country: "FRANCE" },
  { name: "Scotland · Premiership", country: "SCOTLAND" },
  { name: "Netherlands · Eredivisie", country: "NETHERLANDS" },
];

const EXTRA_SPORTS = [
  { name: "PRO BOX PLUS", sport: "Fight", group: "BOXING" },
  { name: "UFC PLUS", sport: "Fight", group: "MMA" },
  { name: "F1", sport: "F1", group: "MOTORSPORT" },
];

export function HomeLiveSports({ fixtures, requestUrl }: Props) {
  const film = useRef<HTMLVideoElement>(null);
  const [filmPaused, setFilmPaused] = useState(true);
  const [showCountryLeagues, setShowCountryLeagues] = useState(false);
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    setFilmPaused(preference.matches);
  }, []);
  useEffect(() => {
    if (filmPaused) film.current?.pause();
    else film.current?.play().catch(() => setFilmPaused(true));
  }, [filmPaused]);
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
          <video ref={film} className="home-match-film" muted loop playsInline preload="metadata" poster="/photos/tebra-video-poster.jpg" aria-hidden="true">
            <source src="/photos/tebra-atmosphere.mp4" type="video/mp4" />
          </video>
          <div className="home-match-shade" aria-hidden="true" />
          <button type="button" className="home-film-control" onClick={() => setFilmPaused(!filmPaused)} aria-label={filmPaused ? "Play atmosphere video" : "Pause atmosphere video"}>{filmPaused ? "Play video ▷" : "Pause video Ⅱ"}</button>
          <div>
            <p className="label-eyebrow"><Tv size={16} aria-hidden="true" /> LIVE SPORT · HERSONISSOS, CRETE</p>
            <h1 id="live-sports-title">Your match.<br /><span>Your place.</span></h1>
          </div>
          <div className="home-sports-intro"><p>Find your match. Check the Greek time.<br />Make it a Tebra evening.</p><a href="/sports-desk" className="home-text-link">Full programme <ArrowUpRight size={18} aria-hidden="true" /></a></div>
        </div>

        <div className="home-league-offer" aria-labelledby="home-league-title">
          <div className="home-league-heading">
            <div><p className="label-eyebrow">WHAT CAN YOU WATCH?</p><h2 id="home-league-title">Choose your competition.</h2><p>Three featured competitions, with every other country grouped under Leagues.</p></div>
            <a href="/sports-desk" className="home-text-link">Full sports desk <ArrowUpRight size={16} aria-hidden="true" /></a>
          </div>

          <div className="home-league-grid home-featured-competitions">
            {FEATURED_COMPETITIONS.map(league => <a key={league.name} href="/sports-desk?sport=Football" className="home-league-card">
              <span>{league.group}</span><strong>{league.name}</strong><span className="home-league-arrow" aria-hidden="true">↗</span>
            </a>)}
            <button type="button" className="home-league-card home-leagues-toggle" style={{ appearance: "none", font: "inherit", color: "inherit", cursor: "pointer", textAlign: "left" }} aria-expanded={showCountryLeagues} aria-controls="home-country-leagues" onClick={() => setShowCountryLeagues(!showCountryLeagues)}>
              <span>ALL COUNTRIES</span><strong>LIGES</strong><span className="home-league-arrow" aria-hidden="true">{showCountryLeagues ? "−" : "+"}</span>
            </button>
          </div>

          {showCountryLeagues && <div id="home-country-leagues" className="home-country-leagues">
            <p className="label-eyebrow">LEAGUES BY COUNTRY</p>
            <div className="home-league-grid">
              {COUNTRY_LEAGUES.map(league => <a key={league.name} href="/sports-desk?sport=Football" className="home-league-card">
                <span>{league.country}</span><strong>{league.name.split(" · ")[1]}</strong><span className="home-league-arrow" aria-hidden="true">↗</span>
              </a>)}
            </div>
          </div>}

          <div className="home-league-grid home-extra-sports">
            {EXTRA_SPORTS.map(item => <a key={item.name} href={`/sports-desk?sport=${encodeURIComponent(item.sport)}`} className="home-league-card">
              <span>{item.group}</span><strong>{item.name}</strong><span className="home-league-arrow" aria-hidden="true">↗</span>
            </a>)}
          </div>
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
