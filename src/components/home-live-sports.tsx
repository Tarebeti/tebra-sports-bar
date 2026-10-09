import { Link } from "@tanstack/react-router";
import { ArrowUpRight, CalendarDays, Clock3, MessageCircle, Tv } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { fixtureDate, greekTime, selectFixtures, type VerifiedFixture } from "@/lib/sports-fixtures";

type Props = {
  fixtures: readonly VerifiedFixture[];
  requestUrl: (message: string) => string;
};

export function HomeLiveSports({ fixtures, requestUrl }: Props) {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(timer);
  }, []);
  const selected = now ? selectFixtures(fixtures, now) : { today: [], upcoming: [] };

  return (
    <section id="live-sports" aria-labelledby="live-sports-title" className="border-y border-gold/30 bg-background">
      <div className="mx-auto max-w-6xl px-4 py-9 md:px-8 md:py-12">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 sm:flex sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase text-gold"><Tv className="h-4 w-4 shrink-0" aria-hidden="true" /> Sports Desk</p>
            <h2 id="live-sports-title" className="mt-2 font-display text-3xl leading-tight text-ivory sm:text-4xl">Live sport at Tebra</h2>
          </div>
          <span className="flex shrink-0 items-center gap-1.5 pt-1 text-xs text-ivory-dim"><Clock3 className="h-4 w-4" aria-hidden="true" /> Greek time</span>
        </div>

        <div className="mt-6 grid gap-7 md:grid-cols-2 md:gap-8" aria-busy={!now}>
          <FixtureGroup title="Today" fixtures={selected.today} loading={!now} requestUrl={requestUrl} />
          <FixtureGroup title="Coming up" fixtures={selected.upcoming} loading={!now} requestUrl={requestUrl} />
        </div>

        <div className="mt-7 grid gap-4 border-t border-gold/20 pt-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
          <p className="min-w-0 text-sm leading-relaxed text-ivory-dim">Request your match and table on WhatsApp. Tebra will confirm availability.</p>
          <div className="grid gap-2 sm:flex sm:items-center">
            <Button asChild className="h-auto min-h-12 bg-gold-gradient px-5 py-3 font-semibold text-primary-foreground">
              <a href={requestUrl("Hi TE.BRA, I would like to request a table for live sport. Please confirm the match and table availability.")} target="_blank" rel="noopener noreferrer"><MessageCircle aria-hidden="true" /> Request a table</a>
            </Button>
            <Button asChild variant="ghost" className="min-h-12 text-gold hover:bg-gold/10 hover:text-gold-bright">
              <a href="/sports-desk">Full programme <ArrowUpRight aria-hidden="true" /></a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function FixtureGroup({ title, fixtures, loading, requestUrl }: {
  title: string;
  fixtures: readonly VerifiedFixture[];
  loading: boolean;
  requestUrl: Props["requestUrl"];
}) {
  return (
    <div className="min-w-0">
      <h3 className="flex items-center gap-2 border-b border-gold/30 pb-3 font-sans text-sm font-semibold uppercase text-ivory"><CalendarDays className="h-4 w-4 text-gold" aria-hidden="true" /> {title}</h3>
      {fixtures.length ? (
        <ul className="divide-y divide-gold/15">
          {fixtures.map((fixture) => (
            <li key={fixture.id} className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-3 gap-y-2 py-4">
              <div className="min-w-0">
                <p className="text-xs leading-relaxed text-ivory-dim">{fixture.competition} · {fixture.sport}</p>
                <h4 className="mt-1 break-words font-sans text-base font-semibold leading-snug text-ivory">{fixture.title}</h4>
                <a href={fixture.sourceUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex min-h-6 items-center gap-1 text-xs text-gold underline underline-offset-4">{fixture.sourceName} <ArrowUpRight className="h-3 w-3" aria-hidden="true" /></a>
              </div>
              <div className="shrink-0 text-right">
                <time dateTime={fixture.startsAt} className="block text-xl font-semibold tabular-nums text-gold-bright">{greekTime(fixture.startsAt)}</time>
                <span className="mt-1 block text-xs text-ivory-dim">{fixtureDate(fixture.startsAt)}</span>
              </div>
              <Button asChild variant="outline" className="col-span-2 mt-1 min-h-11 w-full border-gold/40 text-ivory hover:bg-gold/10 hover:text-ivory sm:w-fit">
                <a href={requestUrl(`Hi TE.BRA, I would like to request a table for ${fixture.title} on ${fixtureDate(fixture.startsAt)} at ${greekTime(fixture.startsAt)} Greek time. Please confirm the screening and table availability.`)} target="_blank" rel="noopener noreferrer"><MessageCircle aria-hidden="true" /> Request a table</a>
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="py-5 text-sm leading-relaxed text-ivory-dim">{loading ? "Checking the programme…" : title === "Today" ? "No confirmed fixtures for today. Ask us about your match." : "More fixtures will appear once confirmed by official sources."}</p>
      )}
    </div>
  );
}