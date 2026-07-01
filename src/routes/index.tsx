import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import heroImg from "@/assets/hero.jpg";
import lounge1 from "@/assets/lounge-1.jpg";
import lounge2 from "@/assets/lounge-2.jpg";
import cocktailsImg from "@/assets/cocktails.jpg";
import screensImg from "@/assets/screens.jpg";
import exteriorImg from "@/assets/exterior-dusk.jpg";
import logo from "@/assets/logo.png";
import { getReviews, getSummary, type Review } from "@/lib/reviews";

// ---- CONFIG: owner should confirm before launch ----
const CONFIG = {
  phone: "+30 000 000 0000", // TODO owner: real phone
  whatsapp: "30000000000", // TODO owner: intl no plus, e.g. 306912345678
  address: "Hersonissos, Crete 70014, Greece", // TODO owner: full street
  menuUrl: "#menu", // TODO owner: link to menu PDF
  coords: { lat: 35.31635468, lng: 25.387603686 },
  hoursLocal: { open: 11, close: 24 }, // 11:00 til midnight, Europe/Athens
};

const NAV = [
  { href: "#experience", label: "Experience" },
  { href: "#sport", label: "Sport" },
  { href: "#drinks", label: "Drinks" },
  { href: "#reviews", label: "Reviews" },
  { href: "#find-us", label: "Find Us" },
];

const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${CONFIG.coords.lat},${CONFIG.coords.lng}`;
const mapEmbed = `https://www.google.com/maps?q=${CONFIG.coords.lat},${CONFIG.coords.lng}&z=15&output=embed`;

function whatsappUrl(text: string) {
  return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`;
}

// ---------- Open now pill (Europe/Athens) ----------
function useAthensNow() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);
  return now;
}

function getOpenState(now: Date) {
  // Convert current instant to Europe/Athens wall clock parts.
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Athens",
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    weekday: "short",
  }).formatToParts(now);
  const hour = parseInt(parts.find((p) => p.type === "hour")!.value, 10);
  const minute = parseInt(parts.find((p) => p.type === "minute")!.value, 10);
  const mins = hour * 60 + minute;
  const openMins = CONFIG.hoursLocal.open * 60;
  const closeMins = CONFIG.hoursLocal.close * 60; // 1440 = midnight
  const isOpen = mins >= openMins && mins < closeMins;
  return { isOpen, hour, minute };
}

// ---------- UI atoms ----------
function GoldStars({ n = 5, size = 14 }: { n?: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${n} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill={i < n ? "url(#gold)" : "none"} stroke="url(#gold)" strokeWidth="1.5">
          <defs>
            <linearGradient id="gold" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="#C9A24B" />
              <stop offset="100%" stopColor="#F0D98C" />
            </linearGradient>
          </defs>
          <path d="M12 2l2.9 6.9L22 10l-5.5 4.8L18 22l-6-3.6L6 22l1.5-7.2L2 10l7.1-1.1L12 2z" />
        </svg>
      ))}
    </span>
  );
}

function GoldPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-surface-raised/60 px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] text-ivory">
      {children}
    </span>
  );
}

function BtnPrimary({ href, children, ...rest }: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      href={href}
      {...rest}
      className={`group inline-flex items-center justify-center gap-2 rounded-md bg-gold-gradient px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-background shadow-[0_10px_30px_-10px_rgba(201,162,75,0.55)] transition-all hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-10px_rgba(240,217,140,0.6)] ${rest.className ?? ""}`}
    >
      {children}
    </a>
  );
}

function BtnOutline({ href, children, ...rest }: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      href={href}
      {...rest}
      className={`inline-flex items-center justify-center gap-2 rounded-md border border-gold/50 bg-transparent px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-ivory transition-colors hover:bg-gold/10 ${rest.className ?? ""}`}
    >
      {children}
    </a>
  );
}

// ---------- Route ----------
export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div className="min-h-screen bg-background text-ivory">
      <Header />
      <main>
        <Hero />
        <TrustBar />
        <Experience />
        <Sport />
        <Drinks />
        <Reviews />
        <FAQ />
        <FindUs />
      </main>
      <Footer />
      <MobileStickyBar />
    </div>
  );
}

// ---------- Header ----------
function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const now = useAthensNow();
  const { isOpen, hour } = getOpenState(now);
  const label = isOpen ? "Open now" : hour < CONFIG.hoursLocal.open ? `Opens at 11:00` : `Opens tomorrow 11:00`;

  return (
    <header className="sticky top-0 z-40 border-b border-gold/10 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
        <a href="#top" className="flex items-center gap-3">
          <img src={logo} alt="TE.BRA Sports Bar crest" className="h-10 w-10 object-contain" />
          <span className="hidden font-display text-lg tracking-wide text-ivory sm:inline">TE.BRA</span>
        </a>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className="link-sweep text-sm text-ivory-dim hover:text-ivory">
              {n.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <span
            className={`hidden items-center gap-2 rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.16em] md:inline-flex ${
              isOpen ? "bg-open/15 text-open border border-open/40" : "bg-surface-raised text-ivory-dim border border-border"
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${isOpen ? "bg-open animate-pulse" : "bg-ivory-dim"}`} />
            {label}
          </span>
          <BtnPrimary href={directionsUrl} target="_blank" rel="noopener" className="hidden md:inline-flex">
            Get Directions
          </BtnPrimary>
          <a
            href={whatsappUrl("Hi TE.BRA")}
            target="_blank"
            rel="noopener"
            aria-label="Message on WhatsApp"
            className="rounded-md border border-gold/40 p-2 text-gold hover:bg-gold/10 md:hidden"
          >
            <IconWhatsapp className="h-5 w-5" />
          </a>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="rounded-md border border-gold/40 p-2 text-ivory lg:hidden"
            aria-label="Toggle menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              {menuOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-gold/10 bg-background lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={() => setMenuOpen(false)}
                className="rounded px-3 py-2.5 text-ivory-dim hover:bg-surface-raised hover:text-ivory"
              >
                {n.label}
              </a>
            ))}
            <BtnPrimary href={directionsUrl} target="_blank" rel="noopener" className="mt-2 w-full">
              Get Directions
            </BtnPrimary>
          </nav>
        </div>
      )}
    </header>
  );
}

// ---------- Hero ----------
function Hero() {
  return (
    <section id="top" className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <img
          src={heroImg}
          alt="Interior of TE.BRA Sports Bar Hersonissos at night, art deco lounge with big screens showing live football"
          className="h-full w-full object-cover opacity-55"
          width={1920}
          height={1280}
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,var(--background)_85%)]" />
      </div>

      <div className="mx-auto grid min-h-[92vh] max-w-6xl place-items-center px-4 py-24 md:px-8">
        <div className="w-full max-w-3xl text-center animate-fade-up">
          <p className="label-eyebrow">Hersonissos, Crete</p>
          <h1 className="mt-6 font-display text-5xl leading-[1.05] text-ivory sm:text-6xl md:text-7xl">
            The most stylish{" "}
            <span className="text-gold-gradient italic">sports bar</span>
            <br className="hidden sm:block" /> in Hersonissos.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base text-ivory-dim md:text-lg">
            Cold drinks, big screens, deco lounge vibes, five minutes from the strip.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            <GoldPill>5.0 on Tripadvisor</GoldPill>
            <GoldPill>#1 Nightlife in Hersonissos</GoldPill>
            <GoldPill>Travelers&rsquo; Choice 2026</GoldPill>
            <GoldPill>86 plus five star reviews</GoldPill>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <BtnPrimary href={directionsUrl} target="_blank" rel="noopener">
              Get Directions
            </BtnPrimary>
            <BtnOutline href="#sport">Book a table for the match</BtnOutline>
          </div>

          <p className="mt-6 text-xs uppercase tracking-[0.24em] text-ivory-dim">
            Open daily, 11:00 til late
          </p>
        </div>
      </div>
    </section>
  );
}

// ---------- Trust bar ----------
function TrustBar() {
  const s = getSummary();
  return (
    <section aria-label="Ratings and awards" className="border-y border-gold/10 bg-surface-raised/40">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-4 px-4 py-6 text-sm text-ivory-dim md:px-8">
        <div className="flex items-center gap-3">
          <span className="font-display text-2xl text-ivory">{s.rating.toFixed(1)}</span>
          <GoldStars n={5} size={16} />
          <span>{s.total} reviews on Tripadvisor</span>
        </div>
        <span className="hidden h-4 w-px bg-gold/25 md:inline" />
        <span className="label-eyebrow">Travelers&rsquo; Choice 2026</span>
        <span className="hidden h-4 w-px bg-gold/25 md:inline" />
        <span className="label-eyebrow">#1 Nightlife, Hersonissos</span>
      </div>
    </section>
  );
}

// ---------- Experience ----------
function Experience() {
  const cards = [
    {
      icon: <IconDiamond />,
      title: "Deco lounge, done right",
      body: "Scandi chic decor, comfortable seating, spotless, air conditioned.",
    },
    {
      icon: <IconScreens />,
      title: "Every game, every screen",
      body: "Multiple large satellite screens. All the football and major sport, live.",
    },
    {
      icon: <IconGlass />,
      title: "Cocktails with talent behind them",
      body: "Handcrafted cocktails, generous measures, premium spirits, cold beer and wine.",
    },
    {
      icon: <IconCue />,
      title: "Play a little",
      body: "Pool table and darts, in a room that still feels grown up.",
    },
  ];
  return (
    <section id="experience" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <header className="mx-auto max-w-2xl text-center">
          <p className="label-eyebrow">The experience</p>
          <h2 className="mt-4 font-display text-4xl text-ivory md:text-5xl">
            Where relaxation meets{" "}
            <span className="text-gold-gradient italic">sophistication</span>.
          </h2>
          <div className="gold-hairline mx-auto mt-8 w-40" />
        </header>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {cards.map((c) => (
            <article
              key={c.title}
              className="deco-frame group relative bg-surface-raised/60 p-6 transition-all hover:-translate-y-1 hover:border-gold/40"
            >
              <div className="text-gold">{c.icon}</div>
              <h3 className="mt-5 font-display text-xl text-ivory">{c.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ivory-dim">{c.body}</p>
            </article>
          ))}
        </div>

        <div className="mt-16 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          <img src={lounge1} alt="Deco lounge seating inside TE.BRA sports bar Hersonissos" loading="lazy" className="aspect-[4/5] w-full rounded-md object-cover" />
          <img src={cocktailsImg} alt="Handcrafted cocktails at TE.BRA cocktail bar Hersonissos" loading="lazy" className="aspect-[4/5] w-full rounded-md object-cover" />
          <img src={screensImg} alt="Watch Champions League on multiple big screens at TE.BRA Crete" loading="lazy" className="aspect-[4/5] w-full rounded-md object-cover" />
          <img src={lounge2} alt="Pool table at TE.BRA sports bar Chersonissos" loading="lazy" className="aspect-[4/5] w-full rounded-md object-cover" />
        </div>
      </div>
    </section>
  );
}

// ---------- Sport ----------
function Sport() {
  const [match, setMatch] = useState("");
  const [party, setParty] = useState("2");
  const [when, setWhen] = useState("");

  const message = useMemo(() => {
    const m = match || "the match";
    const w = when || "date and time";
    return `Hi TE.BRA, I would like to reserve a table for ${m} on ${w}, for ${party} people.`;
  }, [match, party, when]);

  return (
    <section id="sport" className="relative py-24 md:py-32">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(138,106,47,0.15),transparent_60%)]" />
      <div className="mx-auto grid max-w-7xl gap-12 px-4 md:grid-cols-2 md:px-8">
        <div>
          <p className="label-eyebrow">Match day</p>
          <h2 className="mt-4 font-display text-4xl text-ivory md:text-5xl">
            Reserve your seat for the <span className="text-gold-gradient italic">big game</span>.
          </h2>
          <p className="mt-5 max-w-md text-ivory-dim">
            Champions League nights, cup finals, Sunday football. Tell us the match, we will save you the best seat in the house.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <BtnPrimary href={whatsappUrl(message)} target="_blank" rel="noopener">
              <IconWhatsapp className="h-4 w-4" /> Reserve on WhatsApp
            </BtnPrimary>
            <BtnOutline href={`tel:${CONFIG.phone.replace(/\s/g, "")}`}>Call us</BtnOutline>
          </div>
          <p className="mt-6 text-xs uppercase tracking-[0.24em] text-ivory-dim">
            Watch football Hersonissos, every week
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            window.open(whatsappUrl(message), "_blank", "noopener");
          }}
          className="deco-frame bg-surface-raised/70 p-6 md:p-8"
        >
          <p className="label-eyebrow">Quick reserve</p>
          <div className="mt-4 grid gap-4">
            <Field label="Which match?" value={match} onChange={setMatch} placeholder="e.g. Real Madrid v Arsenal" />
            <div className="grid grid-cols-2 gap-3">
              <Field label="When?" value={when} onChange={setWhen} placeholder="Wed 8pm" />
              <Field label="Party size" value={party} onChange={setParty} type="number" min={1} />
            </div>
            <button
              type="submit"
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-md bg-gold-gradient px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-background transition-transform hover:-translate-y-0.5"
            >
              Send on WhatsApp
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  ...rest
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value">) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] uppercase tracking-[0.2em] text-ivory-dim">{label}</span>
      <input
        {...rest}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-gold/20 bg-background/60 px-3 py-2.5 text-ivory placeholder:text-ivory-dim/50 focus:border-gold/60 focus:outline-none"
      />
    </label>
  );
}

// ---------- Drinks ----------
function Drinks() {
  const items = [
    { name: "House Signature", note: "The one everyone talks about, ask the bar." },
    { name: "Classic Negroni", note: "Campari, sweet vermouth, gin, orange peel." },
    { name: "Espresso Martini", note: "Cold brew, vodka, coffee liqueur, ivory foam." },
    { name: "Aperol Spritz", note: "Aperol, prosecco, soda, orange." },
    { name: "Cold Beers on Tap", note: "Local and imported, always properly cold." },
    { name: "Wine and Prosecco", note: "Greek and international, by glass or bottle." },
    { name: "Premium Spirits", note: "Aged rum, single malt, small batch gin." },
    { name: "Breakfast and Snacks", note: "Morning menu and bar bites, all day." },
  ];

  return (
    <section id="drinks" className="relative border-t border-gold/10 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid gap-12 md:grid-cols-[1fr_1.2fr]">
          <div>
            <p className="label-eyebrow">Drinks</p>
            <h2 className="mt-4 font-display text-4xl text-ivory md:text-5xl">
              Cocktails in Hersonissos, done <span className="text-gold-gradient italic">properly</span>.
            </h2>
            <p className="mt-5 max-w-md text-ivory-dim">
              Generous measures, premium spirits, cold beer on tap. Breakfast and snacks served throughout the day.
            </p>
            <BtnOutline href={CONFIG.menuUrl} className="mt-8">
              See the full menu
            </BtnOutline>
            <img src={cocktailsImg} alt="Signature cocktails on the bar at TE.BRA" loading="lazy" className="mt-10 hidden aspect-[4/3] w-full rounded-md object-cover md:block" />
          </div>

          <ul className="grid grid-cols-1 gap-x-8 gap-y-1 sm:grid-cols-2" id="menu">
            {items.map((it) => (
              <li key={it.name} className="group border-b border-gold/10 py-4">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-display text-lg text-ivory">{it.name}</span>
                  <span className="h-px flex-1 translate-y-[-4px] bg-gold/20" />
                </div>
                <p className="mt-1 text-sm text-ivory-dim">{it.note}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

// ---------- Reviews ----------
type SortMode = "recent" | "rating";

function Reviews() {
  const summary = getSummary();
  const all = useMemo(() => getReviews(), []);
  const [sort, setSort] = useState<SortMode>("recent");

  const sorted = useMemo(() => {
    const list = [...all];
    if (sort === "rating") list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [all, sort]);

  const newestIds = useMemo(() => {
    const byDate = [...all].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 3);
    return new Set(byDate.map((r) => `${r.name}-${r.date}`));
  }, [all]);

  return (
    <section id="reviews" className="relative border-t border-gold/10 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <header className="mx-auto max-w-2xl text-center">
          <p className="label-eyebrow">Loved by everyone who finds it</p>
          <h2 className="mt-4 font-display text-4xl text-ivory md:text-5xl">
            {summary.rating.toFixed(1)} out of 5, <span className="text-gold-gradient italic">{summary.total} reviews</span>.
          </h2>
          <div className="mt-5 flex items-center justify-center gap-3">
            <GoldStars n={5} size={18} />
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {summary.badges.map((b) => (
              <GoldPill key={b}>{b}</GoldPill>
            ))}
            <GoldPill>Verified on Tripadvisor</GoldPill>
          </div>
        </header>

        <div className="mt-10 flex items-center justify-end gap-2 text-xs uppercase tracking-[0.2em] text-ivory-dim">
          <span>Sort by</span>
          <SortBtn active={sort === "recent"} onClick={() => setSort("recent")}>Most recent</SortBtn>
          <SortBtn active={sort === "rating"} onClick={() => setSort("rating")}>Highest rated</SortBtn>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {sorted.map((r, i) => (
            <ReviewCard key={`${r.name}-${r.date}-${i}`} r={r} isNew={newestIds.has(`${r.name}-${r.date}`)} />
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <BtnOutline href={summary.tripadvisorUrl} target="_blank" rel="noopener">
            Read all reviews on Tripadvisor
          </BtnOutline>
        </div>
      </div>
    </section>
  );
}

function SortBtn({ active, ...p }: { active: boolean } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...p}
      className={`rounded-full border px-3 py-1.5 transition-colors ${
        active ? "border-gold/60 bg-gold/10 text-ivory" : "border-gold/15 text-ivory-dim hover:text-ivory"
      }`}
    />
  );
}

function relativeDate(iso: string) {
  const then = new Date(iso).getTime();
  const days = Math.max(0, Math.round((Date.now() - then) / (1000 * 60 * 60 * 24)));
  if (days === 0) return "Today";
  if (days === 1) return "1 day ago";
  if (days < 30) return `${days} days ago`;
  const months = Math.round(days / 30);
  if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`;
  return `${Math.round(months / 12)} year ago`;
}

function ReviewCard({ r, isNew }: { r: Review; isNew: boolean }) {
  return (
    <article className="deco-frame flex h-full flex-col bg-surface-raised/70 p-6 transition-all hover:-translate-y-1 hover:border-gold/40">
      <div className="flex items-center justify-between">
        <GoldStars n={r.rating} />
        {isNew && (
          <span className="rounded-full border border-gold/60 bg-gold/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-gold">
            New
          </span>
        )}
      </div>
      <h3 className="mt-4 font-display text-xl leading-snug text-ivory">{r.title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-ivory-dim">&ldquo;{r.snippet}&rdquo;</p>
      <footer className="mt-5 flex items-center justify-between border-t border-gold/10 pt-4 text-xs uppercase tracking-[0.16em] text-ivory-dim">
        <span className="text-ivory">{r.name}</span>
        <span>{relativeDate(r.date)}</span>
      </footer>
    </article>
  );
}

// ---------- FAQ ----------
function FAQ() {
  const items = [
    { q: "Where is TE.BRA Sports Bar in Hersonissos?", a: "Near the villas and a short drive from the main strip, in a quieter, nicer setting. Coordinates and directions link are in the Find Us section below." },
    { q: "What sport can I watch at TE.BRA?", a: "Multiple large satellite screens showing football, Champions League, and major live sport. Ask us to put your match on." },
    { q: "Can I reserve a table for a big match?", a: "Yes. Message us on WhatsApp with the match and your party size and we will save you a seat." },
    { q: "Does TE.BRA serve food?", a: "Yes, breakfast, snacks and bar food, alongside cocktails, beer, wine and premium spirits." },
    { q: "What are the opening hours?", a: "Open daily from 11:00 until late." },
    { q: "Is it good for families and groups?", a: "Yes, families and groups are welcome, with pool, darts and comfortable seating." },
  ];
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="relative border-t border-gold/10 py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-4 md:px-8">
        <p className="label-eyebrow text-center">FAQ</p>
        <h2 className="mt-4 text-center font-display text-4xl text-ivory md:text-5xl">
          Good to <span className="text-gold-gradient italic">know</span>.
        </h2>
        <div className="mt-12 divide-y divide-gold/10 border-y border-gold/10">
          {items.map((it, i) => {
            const isOpen = open === i;
            return (
              <div key={it.q}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 py-6 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-display text-lg text-ivory md:text-xl">{it.q}</span>
                  <span className={`text-gold transition-transform ${isOpen ? "rotate-45" : ""}`}>
                    <svg width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </span>
                </button>
                {isOpen && <p className="pb-6 text-sm leading-relaxed text-ivory-dim">{it.a}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ---------- Find us ----------
function FindUs() {
  return (
    <section id="find-us" className="relative border-t border-gold/10 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <p className="label-eyebrow text-center">Find us</p>
        <h2 className="mt-4 text-center font-display text-4xl text-ivory md:text-5xl">
          Come <span className="text-gold-gradient italic">say hello</span>.
        </h2>

        <div className="mt-14 grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div className="deco-frame overflow-hidden">
            <iframe
              title="TE.BRA Sports Bar on Google Maps"
              src={mapEmbed}
              className="h-[420px] w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="flex flex-col justify-between">
            <div>
              <h3 className="font-display text-2xl text-ivory">TE.BRA Sports Bar</h3>
              <p className="mt-3 text-ivory-dim">{CONFIG.address}</p>
              <ul className="mt-6 space-y-2 text-sm text-ivory-dim">
                <li className="flex items-center gap-3">
                  <IconClock className="h-4 w-4 text-gold" />
                  Open daily, 11:00 til late
                </li>
                <li className="flex items-center gap-3">
                  <IconPhone className="h-4 w-4 text-gold" />
                  <a href={`tel:${CONFIG.phone.replace(/\s/g, "")}`} className="link-sweep text-ivory">
                    {CONFIG.phone}
                  </a>
                </li>
              </ul>
              <div className="mt-8 flex flex-wrap gap-3">
                <BtnPrimary href={directionsUrl} target="_blank" rel="noopener">Get directions</BtnPrimary>
                <BtnOutline href={whatsappUrl("Hi TE.BRA")} target="_blank" rel="noopener">
                  <IconWhatsapp className="h-4 w-4" /> Message on WhatsApp
                </BtnOutline>
              </div>
            </div>

            <div className="mt-10 flex items-center gap-5">
              <SocialLink href="https://www.instagram.com/tebra_sports_bar/" label="Instagram"><IconInstagram /></SocialLink>
              <SocialLink href="https://www.facebook.com/p/TEBRA-Sports-Bar-61578308090517/" label="Facebook"><IconFacebook /></SocialLink>
              <SocialLink href={getSummary().tripadvisorUrl} label="Tripadvisor"><IconGlobe /></SocialLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SocialLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener" aria-label={label} className="text-ivory-dim transition-colors hover:text-gold">
      {children}
    </a>
  );
}

// ---------- Footer ----------
function Footer() {
  return (
    <footer className="border-t border-gold/10 bg-background/80 pb-24 pt-12 md:pb-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 text-center md:px-8">
        <img src={exteriorImg} alt="TE.BRA sports bar exterior at dusk in Hersonissos, Crete" loading="lazy" className="hidden" />
        <img src={logo} alt="TE.BRA crest" className="h-12 w-12 object-contain" />
        <p className="font-display text-lg italic text-ivory-dim">
          Where the game meets the good life.
        </p>
        <div className="gold-hairline w-40" />
        <p className="text-xs uppercase tracking-[0.2em] text-ivory-dim">
          &copy; {new Date().getFullYear()} TE.BRA Sports Bar, Hersonissos, Crete
        </p>
      </div>
    </footer>
  );
}

// ---------- Mobile sticky bar ----------
function MobileStickyBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 gap-2 border-t border-gold/20 bg-background/95 p-3 backdrop-blur md:hidden">
      <a
        href={directionsUrl}
        target="_blank"
        rel="noopener"
        className="inline-flex items-center justify-center gap-2 rounded-md bg-gold-gradient px-4 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-background"
      >
        Directions
      </a>
      <a
        href={whatsappUrl("Hi TE.BRA")}
        target="_blank"
        rel="noopener"
        className="inline-flex items-center justify-center gap-2 rounded-md border border-gold/50 px-4 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-ivory"
      >
        <IconWhatsapp className="h-4 w-4" /> WhatsApp
      </a>
    </div>
  );
}

// ---------- Icons ----------
function IconDiamond() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M12 2l10 10-10 10L2 12 12 2z" />
      <path d="M7 12h10M12 7v10" />
    </svg>
  );
}
function IconScreens() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      <rect x="2" y="4" width="14" height="10" rx="1" />
      <rect x="10" y="10" width="12" height="8" rx="1" />
    </svg>
  );
}
function IconGlass() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M6 3h12l-2 8a4 4 0 01-8 0L6 3z" />
      <path d="M12 15v6M9 21h6" />
    </svg>
  );
}
function IconCue() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      <circle cx="7" cy="17" r="3" />
      <path d="M9 15L21 3" />
    </svg>
  );
}
function IconWhatsapp({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M20 3.5A11 11 0 002.6 17L2 22l5.2-.6A11 11 0 1020 3.5zM12 20a8 8 0 01-4-1.1l-.3-.2-3 .4.4-3-.2-.3A8 8 0 1112 20zm4.3-5.6c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1l-.7 1c-.2.2-.3.2-.5.1a6.5 6.5 0 01-3.2-2.8c-.2-.4.2-.4.6-1.2.1-.2.1-.4 0-.5l-.7-1.7c-.2-.5-.4-.4-.5-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.1s.9 2.5 1.1 2.7c.1.2 1.9 3 4.6 4 .6.3 1.1.4 1.5.5.6.2 1.2.2 1.6.1.5-.1 1.4-.6 1.6-1.1.2-.6.2-1 .1-1.1z" />
    </svg>
  );
}
function IconPhone({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 012 4.2 2 2 0 014 2h3a2 2 0 012 1.7c.1.9.3 1.8.6 2.7a2 2 0 01-.5 2.1L7.9 9.8a16 16 0 006 6l1.3-1.2a2 2 0 012.1-.5c.9.3 1.8.5 2.7.6a2 2 0 011.7 2z" />
    </svg>
  );
}
function IconClock({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />
    </svg>
  );
}
function IconInstagram() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="18" height="18" rx="4" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
    </svg>
  );
}
function IconFacebook() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M13 22v-8h3l1-4h-4V7.5c0-1.1.3-1.9 2-1.9h2V2.1A28 28 0 0014.4 2c-2.9 0-4.9 1.8-4.9 5v3h-3v4h3v8h3.5z" />
    </svg>
  );
}
function IconGlobe() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a15 15 0 010 18M12 3a15 15 0 000 18" />
    </svg>
  );
}
