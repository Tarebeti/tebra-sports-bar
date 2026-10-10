import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useScroll, useTransform, useInView } from "motion/react";
import { useQuery } from "@tanstack/react-query";
import { getReviews, getSummary, type Review } from "@/lib/reviews";
import { loadProgramme, type ProgrammeFeed } from "@/lib/programme-feed";
import programmeSnapshot from "../../public/sports-programme.json";
import { selectProgrammeCards } from "@/lib/sports-fixtures";
import { getLiveReviews } from "@/lib/reviews.functions";

// ---- Real image assets (self hosted via Lovable Assets CDN) ----
import logoAsset from "@/assets/venue/logo.png.asset.json";
import img10 from "@/assets/venue/os_bar_10.jpg.asset.json";
import img11 from "@/assets/venue/os_bar_11.jpg.asset.json";
import img12 from "@/assets/venue/os_bar_12.jpg.asset.json";
import img13 from "@/assets/venue/os_bar_13.jpg.asset.json";
import img14 from "@/assets/venue/os_bar_14.jpg.asset.json";
import img15 from "@/assets/venue/os_bar_15.jpg.asset.json";
import img16 from "@/assets/venue/os_bar_16.jpg.asset.json";
import img17 from "@/assets/venue/os_bar_17.jpg.asset.json";
import img18 from "@/assets/venue/os_bar_18.jpg.asset.json";
import img19 from "@/assets/venue/os_bar_19.jpg.asset.json";
import img20 from "@/assets/venue/os_bar_20.jpg.asset.json";
import img21 from "@/assets/venue/os_bar_21.jpg.asset.json";
import img22 from "@/assets/venue/os_bar_22.jpg.asset.json";
import img23 from "@/assets/venue/os_bar_23.jpg.asset.json";
import img24 from "@/assets/venue/os_bar_24.jpg.asset.json";
import img25 from "@/assets/venue/os_bar_25.jpg.asset.json";
import img26 from "@/assets/venue/os_bar_26.jpg.asset.json";
import img27 from "@/assets/venue/os_bar_27.jpg.asset.json";
import img28 from "@/assets/venue/os_bar_28.jpg.asset.json";
import img29 from "@/assets/venue/os_bar_29.jpg.asset.json";
import img30 from "@/assets/venue/os_bar_30.jpg.asset.json";
import img31 from "@/assets/venue/os_bar_31.jpg.asset.json";
import img32 from "@/assets/venue/os_bar_32.jpg.asset.json";
import img33 from "@/assets/venue/os_bar_33.jpg.asset.json";
import img34 from "@/assets/venue/os_bar_34.jpg.asset.json";
import img35 from "@/assets/venue/os_bar_35.jpg.asset.json";
import img36 from "@/assets/venue/os_bar_36.jpg.asset.json";
import img37 from "@/assets/venue/os_bar_37.jpg.asset.json";
import img38 from "@/assets/venue/os_bar_38.jpg.asset.json";
import img39 from "@/assets/venue/os_bar_39.jpg.asset.json";

// Real user-supplied venue photos (freshest, highest priority)
import realExteriorNight from "@/assets/venue/real_exterior_night.jpg.asset.json";
import realPoolCrowd from "@/assets/venue/real_pool_crowd.jpg.asset.json";
import realBreakfastGroup from "@/assets/venue/real_breakfast_group.jpg.asset.json";
import realFoodGroup from "@/assets/venue/real_food_group.jpg.asset.json";
import realExteriorDusk from "@/assets/venue/real_exterior_dusk.jpg.asset.json";
import realExteriorLounge from "@/assets/venue/real_exterior_lounge.jpg.asset.json";
import realBarCocktails from "@/assets/venue/real_bar_cocktails.jpg.asset.json";
import realWorldCup from "@/assets/venue/real_worldcup_2026.jpg.asset.json";
import menuPdf from "@/assets/venue/tebra-menu.pdf.asset.json";

const LOGO = logoAsset.url;

// Curated slots — prioritise the real venue photos supplied by the owner
const HERO_COCKTAIL = img25.url;                    // cinematic cocktail hero
const EXTERIOR_DUSK = realExteriorDusk.url;         // real exterior at dusk
const LOUNGE_1 = realExteriorLounge.url;            // real front lounge
const LOUNGE_2 = realBreakfastGroup.url;            // real interior group breakfast
const SCREENS = realWorldCup.url;                   // World Cup 2026 banner
const POOL_DARTS = realPoolCrowd.url;               // real pool + crowd watching sport
const FOOD = realFoodGroup.url;                     // real group enjoying food
const DRINK_2 = realBarCocktails.url;               // real bar with fruit + spirits
const DETAIL_1 = img36.url;
const DETAIL_2 = img38.url;

const GALLERY = [
  { src: realExteriorNight.url, alt: "TE.BRA Sports Bar entrance lit up at night in Hersonissos" },
  { src: realExteriorDusk.url, alt: "TE.BRA Sports Bar exterior at dusk in Hersonissos Crete" },
  { src: realPoolCrowd.url, alt: "Guests watching sport around the pool table at TE.BRA Hersonissos" },
  { src: realBreakfastGroup.url, alt: "Friends enjoying breakfast at TE.BRA Sports Bar Hersonissos" },
  { src: realFoodGroup.url, alt: "Group sharing food and drinks at TE.BRA Hersonissos" },
  { src: realExteriorLounge.url, alt: "Outdoor lounge seating at TE.BRA cocktail bar Hersonissos" },
  { src: realBarCocktails.url, alt: "Cocktail bar with fresh fruit and premium spirits at TE.BRA" },
  { src: realWorldCup.url, alt: "FIFA World Cup 2026 backdrop at TE.BRA Sports Bar" },
  { src: img10.url, alt: "Deco lounge seating at TE.BRA cocktail bar Hersonissos" },
  { src: img12.url, alt: "Warm bar lighting and glassware at TE.BRA Hersonissos" },
  { src: img17.url, alt: "Big screens and lounge at TE.BRA sports bar Hersonissos" },
  { src: img18.url, alt: "Signature drink at TE.BRA cocktail bar Hersonissos Crete" },
  { src: img21.url, alt: "Cocktail served at TE.BRA bar Hersonissos" },
  { src: img26.url, alt: "Late night lounge vibes at TE.BRA Hersonissos" },
  { src: img29.url, alt: "Cocktail garnish detail at TE.BRA Hersonissos" },
  { src: img32.url, alt: "Exterior signage at TE.BRA Sports Bar Hersonissos" },
  { src: img34.url, alt: "Bar shelves and premium spirits at TE.BRA Hersonissos" },
  { src: img35.url, alt: "Champagne gold accents at TE.BRA bar Hersonissos" },
  { src: img39.url, alt: "Warm evening atmosphere at TE.BRA cocktail bar Hersonissos" },
];


// ---- Owner details to confirm before launch ----
const CONFIG = {
  phone: "+30 699 339 9000",
  whatsapp: "306993399000",
  address: "Hersonissos, Crete 70014, Greece",
  menuUrl: menuPdf.url,
  coords: { lat: 35.31635468, lng: 25.387603686 },
  hoursLocal: { open: 11, close: 24 },
};

const NAV = [
  { href: "/sports-desk", label: "Sports Desk" },
  { href: "#sport", label: "Sport" },
  { href: "#games", label: "Games" },
  { href: "#food", label: "Food" },
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
  const closeMins = CONFIG.hoursLocal.close * 60;
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

function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.2, 0.7, 0.2, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ---------- Route ----------
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TE.BRA | Cocktail & Sports Bar in Hersonissos, Crete" },
      { name: "description", content: "Cocktails, live sport, pool, darts and food at TE.BRA Sports Bar in Hersonissos, Crete. Open daily. Rated 5.0 on Tripadvisor from 214 reviews." },
      { property: "og:title", content: "TE.BRA | Cocktail & Sports Bar in Hersonissos, Crete" },
      { property: "og:description", content: "Cocktails, live sport, pool, darts and food at TE.BRA Sports Bar in Hersonissos, Crete." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://tebrabar.com/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://tebrabar.com/" }],
  }),
  component: Home,
});

function Home() {
  return (
    <div className="min-h-screen bg-background text-ivory [&_section[id]]:scroll-mt-20">
      <Header />
      <main>
        <HomepageProgramme />
        <Hero />
        <SportsBanner />
        <TrustBar />
        
        <Sport />
        <Games />
        <Food />
        <Experience />
        <Gallery />
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
  const label = isOpen ? "Open now" : hour < CONFIG.hoursLocal.open ? "Opens at 11:00" : "Opens tomorrow 11:00";

  return (
    <header className="sticky top-0 z-40 border-b border-gold/10 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
        <a href="#top" className="flex shrink-0 items-center gap-2">
          <img src={LOGO} alt="TE.BRA Sports Bar gold crest logo" className="h-11 w-11 object-contain" />
          <span className="font-display text-lg tracking-wide text-ivory">TE.BRA</span>
        </a>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className="link-sweep text-sm text-ivory-dim hover:text-ivory">
              {n.label}
            </a>
          ))}
          <Link to="/active" className="link-sweep text-sm font-semibold text-gold">
            TEBRA ACTIVE
          </Link>
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
          <div className="hidden xl:block">
            <BtnPrimary href={directionsUrl} target="_blank" rel="noopener">
              Get Directions
            </BtnPrimary>
          </div>
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
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              {menuOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-gold/10 bg-background lg:hidden">
          <nav id="mobile-navigation" aria-label="Mobile navigation" className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4">
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
            <Link
              to="/active"
              onClick={() => setMenuOpen(false)}
              className="rounded px-3 py-2.5 font-semibold text-gold hover:bg-surface-raised"
            >
              TEBRA ACTIVE
            </Link>
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
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.05, 1.18]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section id="top" ref={ref} className="relative isolate overflow-hidden">
      <motion.div style={{ y, scale }} className="absolute inset-0 -z-10">
        <img
          src={HERO_COCKTAIL}
          alt="Signature cocktail on the bar at TE.BRA cocktail bar in Hersonissos, Crete"
          className="h-full w-full object-cover opacity-60"
          width={1920}
          height={1280}
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/65 to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,var(--background)_85%)]" />
      </motion.div>

      <motion.div style={{ opacity }} className="mx-auto grid min-h-[65vh] max-w-6xl place-items-center px-4 py-24 md:px-8">
        <div className="w-full max-w-3xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="label-eyebrow"
          >
            Hersonissos, Crete
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.2, 0.7, 0.2, 1] }}
            className="mt-6 font-display text-3xl leading-tight text-ivory sm:text-4xl sm:leading-[1.05] md:text-6xl lg:text-7xl"
          >
            Your match. Your <span className="text-gold-gradient italic">people.</span>
            <br className="hidden sm:block" /> Your place in Crete.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mx-auto mt-6 max-w-xl text-[17px] leading-relaxed text-ivory md:text-lg"
          >
            Welcome to <strong className="font-semibold text-ivory">TE.BRA Premium Sports Bar in Hersonissos</strong>. Come for the sport. Stay for cocktails, food, pool and darts — and a warm welcome from Zac and Valentina.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-2"
          >
            <GoldPill>5.0 on Tripadvisor</GoldPill>
            <GoldPill>Sport · Cocktails · Good company</GoldPill>
            <GoldPill>{getSummary().total} reviews on Tripadvisor</GoldPill>
            <GoldPill>Google 5.0 · 125 reviews</GoldPill>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:items-center"
          >
            <BtnPrimary href="/sports-desk">
              Sports Desk
            </BtnPrimary>
            <BtnPrimary href={directionsUrl} target="_blank" rel="noopener" className="animate-gold-pulse">
              Get Directions
            </BtnPrimary>
            <BtnOutline href="#sport">Request a match table</BtnOutline>
          </motion.div>

          <HeroLiveLine />
        </div>
      </motion.div>

      {/* animated gold hairline */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.4, delay: 0.4, ease: "easeOut" }}
        style={{ transformOrigin: "center" }}
        className="mx-auto h-px w-40 bg-gradient-to-r from-transparent via-gold to-transparent"
      />
    </section>
  );
}

function HeroLiveLine() {
  const now = useAthensNow();
  const { isOpen, hour, minute } = getOpenState(now);
  if (isOpen) {
    const closeH = CONFIG.hoursLocal.close === 24 ? 0 : CONFIG.hoursLocal.close;
    const mLeft = ((CONFIG.hoursLocal.close * 60) - (hour * 60 + minute));
    const hrs = Math.floor(mLeft / 60);
    return (
      <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-open/40 bg-open/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-ivory">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-open opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-open" />
        </span>
        Open now &middot; {hrs > 0 ? `${hrs}h left` : `closes at ${String(closeH).padStart(2,"0")}:00`}
      </p>
    );
  }
  return (
    <p className="mt-6 text-xs uppercase tracking-[0.24em] text-ivory">
      Open daily, 11:00 til late
    </p>
  );
}

// ---------- Sports banner ----------
function HomepageProgramme() {
  const now = useAthensNow();
  const [feed, setFeed] = useState<ProgrammeFeed>(programmeSnapshot);
  const [competition, setCompetition] = useState("All sports");
  const [expanded, setExpanded] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    const refresh = () => loadProgramme(controller.signal).then(setFeed).catch(() => {});
    refresh();
    const interval = window.setInterval(refresh, 300000);
    return () => { controller.abort(); window.clearInterval(interval); };
  }, []);
  const available = feed.events.filter(e => Date.parse(e.start) + 3 * 3600000 > now.getTime());
  const competitions = [...new Set(available.map(e => e.competition))].sort((a,b) => a === "Premier League" ? -1 : b === "Premier League" ? 1 : a.localeCompare(b));
  const { ordered, compact } = selectProgrammeCards(available, competition);
  const visible = expanded ? ordered : compact;
  const checked = feed.checked;
  const formatDate = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Athens", weekday: "short", day: "numeric", month: "short" });
  const formatTime = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Athens", hour: "2-digit", minute: "2-digit", hour12: false });
  return (
    <section id="match-highlights" aria-labelledby="match-highlights-title" className="border-y border-gold/25 bg-surface-raised/60 py-10 md:py-16">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="label-eyebrow">Live sport at Tebra</p>
            <h2 id="match-highlights-title" className="mt-3 font-display text-3xl text-ivory md:text-5xl">Your sport. Your match.</h2>
            <p className="mt-3 text-sm text-ivory-dim">Football, Formula 1 and more · All times in Greece</p>
          </div>
          <BtnOutline href="/sports-desk">Full programme ↗</BtnOutline>
        </div>
        <nav className="mt-7 rounded-2xl border border-gold/25 bg-background p-4 md:p-6" aria-label="Choose a league or sport">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-gold/15 pb-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">Find your match</p>
            <button type="button" aria-pressed={competition === "All sports"} onClick={() => { setCompetition("All sports"); setExpanded(false); }} className={`min-h-11 rounded-full border px-5 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-gold ${competition === "All sports" ? "border-gold bg-gold text-background" : "border-gold/30 text-ivory hover:border-gold"}`}>All sports</button>
          </div>
          {[{ label: "Football leagues & cups", sport: "Football" }, { label: "Motorsport, fights & more", sport: "Other" }].map(group => {
            const entries = competitions.filter(c => available.some(e => e.competition === c && (group.sport === "Football" ? e.sport === "Football" : e.sport !== "Football")));
            if (!entries.length) return null;
            return <div key={group.label} className="mt-5 first:mt-0">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-ivory-dim">{group.label}</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
                {entries.map(c => <button key={c} type="button" aria-pressed={competition === c} onClick={() => { setCompetition(c); setExpanded(false); }} className={`group flex min-h-16 min-w-0 items-center justify-between gap-2 rounded-xl border px-3 py-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-gold md:px-4 ${competition === c ? "border-gold bg-gold text-background" : c === "Premier League" ? "border-gold/60 bg-gold/10 text-ivory hover:bg-gold/20" : "border-ivory/15 bg-surface-raised/40 text-ivory hover:border-gold/60 hover:bg-gold/10"}`}>
                  <span className="break-words text-sm font-semibold leading-snug">{c}</span>
                  <span aria-label="fixtures" className={`flex h-6 min-w-6 shrink-0 items-center justify-center rounded-full px-1 text-[11px] ${competition === c ? "bg-background/15 text-background" : "bg-gold/10 text-gold"}`}>{available.filter(e => e.competition === c).length}</span>
                </button>)}
              </div>
            </div>;
          })}
        </nav>
        <p className="mt-5 text-xs text-ivory-dim">Fixture times checked {checked}. Please ask Tebra to confirm screening and table availability.</p>
        <div className="mt-7 grid items-stretch gap-4 md:grid-cols-3">
          {visible.map(match => <article key={match.id} className="flex flex-col rounded-xl border border-gold/30 bg-background p-5 md:p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-gold">{match.competition}</p>
            <p className="mt-4 text-xs uppercase tracking-wider text-ivory-dim">{formatDate.format(new Date(match.start))} · Greece</p>
            <h3 className="mt-2 break-words text-2xl font-semibold leading-snug text-ivory md:text-[26px]">{match.title}</h3>
            <p className="mt-4 text-3xl font-semibold text-gold">{formatTime.format(new Date(match.start))}</p>
            <a href={match.source} target="_blank" rel="noopener noreferrer" className="mt-3 text-xs text-ivory-dim underline">Official fixture</a>
            <a className="mt-6 block rounded-md bg-gold px-4 py-3 text-center text-sm font-bold text-background" href={whatsappUrl(`Hi TE.BRA, I would like to request a table for ${match.title} on ${formatDate.format(new Date(match.start))} at ${formatTime.format(new Date(match.start))} Greek time. Please confirm screening and availability.`)} target="_blank" rel="noopener noreferrer">Request a table ↗</a>
          </article>)}
        </div>
        {ordered.length > 3 && <button type="button" onClick={() => setExpanded(!expanded)} aria-expanded={expanded} className="mt-5 rounded-md border border-gold/30 px-5 py-3 text-sm text-ivory hover:border-gold">{expanded ? "Show highlights" : `Show all ${ordered.length} fixtures${competition === "All sports" ? "" : ` in ${competition}`}`}</button>}
        {available.length === 0 && <p className="mt-7 text-ivory-dim">Ask us about the next matches and table availability.</p>}
        <div className="mt-6"><BtnOutline href="/sports-desk">More leagues, sports and the full programme ↗</BtnOutline></div>
      </div>
    </section>
  );
}

function SportsBanner() {
  const experiences = [
    { title: "Watch", description: "Find your fixture. Request your table.", image: SCREENS, alt: "Guests watching sport at Tebra", href: "#match-highlights", action: "Explore the programme" },
    { title: "Taste", description: "Cocktails, cold beers and food to share.", image: DRINK_2, alt: "Cocktails served at the Tebra bar", href: "#food", action: "Discover food and drinks" },
    { title: "Stay a little longer", description: "Pool, darts and good company.", image: POOL_DARTS, alt: "Pool and guests at Tebra", href: "#games", action: "See the games" },
  ];
  return (
    <section aria-label="Discover Tebra" className="border-y border-gold/20 bg-surface-raised/40 py-12 md:py-20">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 md:grid-cols-3 md:px-8">
        {experiences.map(item => <a key={item.title} href={item.href} className="group overflow-hidden rounded-xl border border-gold/20 bg-background transition-colors hover:border-gold focus-visible:outline-2 focus-visible:outline-gold">
          <img src={item.image} alt={item.alt} loading="lazy" width={640} height={480} className="aspect-[4/3] w-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-105" />
          <div className="p-6"><h2 className="font-display text-3xl text-ivory">{item.title}</h2><p className="mt-3 text-sm leading-relaxed text-ivory-dim">{item.description}</p><p className="mt-5 text-xs font-semibold uppercase tracking-wider text-gold">{item.action} ↗</p></div>
        </a>)}
      </div>
    </section>
  );
}

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
        <span className="label-eyebrow">#1 of 25 Nightlife in Hersonissos · Tripadvisor</span>
        <div className="flex items-center gap-3"><span className="font-display text-2xl text-ivory">5.0</span><GoldStars n={5} size={16} /><span>125 reviews on Google</span></div>
      </div>
    </section>
  );
}

// ---------- Cocktails (lead section) ----------
function Cocktails() {
  const items = [
    { name: "House Signature", note: "The one everyone talks about, ask the bar." },
    { name: "Classic Negroni", note: "Campari, sweet vermouth, gin, orange peel." },
    { name: "Espresso Martini", note: "Cold brew, vodka, coffee liqueur, ivory foam." },
    { name: "Aperol Spritz", note: "Aperol, prosecco, soda, orange." },
    { name: "Cold Beers on Tap", note: "Local and imported, always properly cold." },
    { name: "Wine and Prosecco", note: "Greek and international, by glass or bottle." },
    { name: "Premium Spirits", note: "Aged rum, single malt, small batch gin." },
    { name: "Soft Drinks and Juices", note: "Freshly poured, no shortcuts." },
  ];

  return (
    <section id="cocktails" className="relative py-16 md:py-32">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_1fr] lg:items-start">
          <FadeUp>
            <p className="label-eyebrow">Cocktails</p>
            <h2 className="mt-4 font-display text-3xl leading-tight text-ivory sm:text-4xl md:text-5xl">
              The best <span className="text-gold-gradient italic">cocktails</span> in town.
            </h2>
            <p className="mt-5 max-w-md text-ivory-dim">
              Handcrafted cocktails with generous measures, mixed by someone with real talent.
              Premium spirits, cold beer, wine and soft drinks. Come thirsty.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <BtnPrimary href="#menu">See the drinks</BtnPrimary>
              <BtnOutline href={CONFIG.menuUrl}>Full menu</BtnOutline>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-3">
              <motion.img
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.5 }}
                src={HERO_COCKTAIL}
                alt="Signature cocktail on the bar at TE.BRA cocktail bar Hersonissos"
                loading="lazy"
                className="aspect-[4/5] w-full rounded-md object-cover"
              />
              <motion.img
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.5 }}
                src={DRINK_2}
                alt="Handcrafted cocktail poured at TE.BRA bar in Hersonissos, Crete"
                loading="lazy"
                className="aspect-[4/5] w-full rounded-md object-cover"
              />
            </div>
          </FadeUp>

          <FadeUp delay={0.15}>
            <ul id="menu" className="grid grid-cols-1 gap-x-8 gap-y-1 sm:grid-cols-2">
              {items.map((it, i) => (
                <motion.li
                  key={it.name}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  className="border-b border-gold/10 py-4"
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="font-display text-lg text-ivory">{it.name}</span>
                    <span className="h-px flex-1 translate-y-[-4px] bg-gold/20" />
                  </div>
                  <p className="mt-1 text-sm text-ivory-dim">{it.note}</p>
                </motion.li>
              ))}
            </ul>
          </FadeUp>
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
    <section id="sport" className="relative border-t border-gold/10 py-20 md:py-32">
      <div className="absolute inset-0 -z-10">
        <img src={SCREENS} alt="" aria-hidden className="h-full w-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/90 to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(138,106,47,0.18),transparent_65%)]" />
      </div>

      <div className="mx-auto grid max-w-7xl gap-12 px-4 md:grid-cols-2 md:px-8">
        <FadeUp>
          <p className="label-eyebrow">Match day</p>
          <h2 className="mt-4 font-display text-3xl leading-tight text-ivory sm:text-4xl md:text-5xl">
            A great seat for your <span className="text-gold-gradient italic">match</span>.
          </h2>
          <p className="mt-5 max-w-md text-ivory-dim">
            Multiple large screens showing football, Champions League and all the major live sport.
            Tell us your match and party size. We will confirm screening and table availability.
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
        </FadeUp>

        <FadeUp delay={0.15}>
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
        </FadeUp>
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

// ---------- Games ----------
function Games() {
  const tiles = [
    { icon: <IconCue />, title: "Pool table", body: "Rack them up, play a few frames." },
    { icon: <IconDart />, title: "Darts", body: "Steady arm, sharp arrows, good company." },
    { icon: <IconDice />, title: "and more", body: "Board games and easy nights, ask at the bar." },
  ];
  return (
    <section id="games" className="relative py-16 md:py-32">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <FadeUp>
            <p className="label-eyebrow">More than a bar</p>
            <h2 className="mt-4 font-display text-3xl leading-tight text-ivory sm:text-4xl md:text-5xl">
              Play a little, <span className="text-gold-gradient italic">settle in</span>.
            </h2>
            <p className="mt-5 max-w-md text-ivory-dim">
              Play a few frames, throw some arrows, settle in. It is that kind of place.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {tiles.map((t, i) => (
                <motion.article
                  key={t.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="deco-frame bg-surface-raised/60 p-5"
                >
                  <div className="text-gold">{t.icon}</div>
                  <h3 className="mt-4 font-display text-base text-ivory sm:text-lg">{t.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-ivory-dim">{t.body}</p>
                </motion.article>
              ))}
            </div>
          </FadeUp>

          <FadeUp delay={0.15}>
            <motion.div
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.6 }}
              className="deco-frame overflow-hidden"
            >
              <img
                src={POOL_DARTS}
                alt="Pool table and games area at TE.BRA sports bar Hersonissos Crete"
                loading="lazy"
                className="aspect-[4/3] w-full object-cover"
              />
            </motion.div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

// ---------- Food ----------
function Food() {
  return (
    <section id="food" className="relative border-t border-gold/10 py-16 md:py-32">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <FadeUp>
            <motion.img
              initial={{ scale: 1.05 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, ease: "easeOut" }}
              src={FOOD}
              alt="Bar food and breakfast plate served at TE.BRA in Hersonissos, Crete"
              loading="lazy"
              className="aspect-[4/3] w-full rounded-md object-cover"
            />
          </FadeUp>
          <FadeUp delay={0.15}>
            <p className="label-eyebrow">Food</p>
            <h2 className="mt-4 font-display text-3xl leading-tight text-ivory sm:text-4xl md:text-5xl">
              Good food, <span className="text-gold-gradient italic">all day</span>.
            </h2>
            <p className="mt-5 max-w-md text-ivory-dim">
              Breakfast in the morning, snacks and proper bar food through the day and night.
              Everything done well, plenty of it.
            </p>
            <ul className="mt-6 grid grid-cols-2 gap-y-2 text-sm text-ivory-dim">
              <li className="flex items-center gap-2"><Dot /> Breakfast</li>
              <li className="flex items-center gap-2"><Dot /> Bar bites</li>
              <li className="flex items-center gap-2"><Dot /> Sharing plates</li>
              <li className="flex items-center gap-2"><Dot /> Vegetarian options</li>
            </ul>
            <div className="mt-8"><BtnOutline href={CONFIG.menuUrl} target="_blank" rel="noopener noreferrer">View the full menu ↗</BtnOutline></div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

function Dot() {
  return <span className="h-1.5 w-1.5 rounded-full bg-gold" />;
}

// ---------- Experience strip ----------
function Experience() {
  const cards = [
    { icon: <IconDiamond />, title: "Deco lounge, done right", body: "Scandi chic, comfortable, spotless, air conditioned." },
    { icon: <IconHeart />, title: "Welcoming owners", body: "Zac and Valentina. Walk in a stranger, leave a friend." },
    { icon: <IconLeaf />, title: "A quieter, nicer setting", body: "A short hop from the busy strip, near the villas." },
  ];
  return (
    <section id="experience" className="relative py-16 md:py-32">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <FadeUp>
          <header className="mx-auto max-w-2xl text-center">
            <p className="label-eyebrow">The experience</p>
            <h2 className="mt-4 font-display text-3xl leading-tight text-ivory sm:text-4xl md:text-5xl">
              Where relaxation meets{" "}
              <span className="text-gold-gradient italic">sophistication</span>.
            </h2>
            <div className="gold-hairline mx-auto mt-8 w-40" />
          </header>
        </FadeUp>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {cards.map((c, i) => (
            <motion.article
              key={c.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              className="deco-frame bg-surface-raised/60 p-6"
            >
              <div className="text-gold">{c.icon}</div>
              <h3 className="mt-5 font-display text-lg text-ivory sm:text-xl">{c.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ivory-dim">{c.body}</p>
            </motion.article>
          ))}
        </div>

        <div className="mt-14 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          <motion.img whileHover={{ scale: 1.03 }} transition={{ duration: 0.5 }} src={LOUNGE_1} alt="Deco lounge seating inside TE.BRA sports bar Hersonissos" loading="lazy" className="aspect-[4/5] w-full rounded-md object-cover" />
          <motion.img whileHover={{ scale: 1.03 }} transition={{ duration: 0.5 }} src={DETAIL_1} alt="Champagne gold detail at TE.BRA cocktail bar Hersonissos" loading="lazy" className="aspect-[4/5] w-full rounded-md object-cover" />
          <motion.img whileHover={{ scale: 1.03 }} transition={{ duration: 0.5 }} src={LOUNGE_2} alt="Comfortable seating and warm lighting at TE.BRA" loading="lazy" className="aspect-[4/5] w-full rounded-md object-cover" />
          <motion.img whileHover={{ scale: 1.03 }} transition={{ duration: 0.5 }} src={DETAIL_2} alt="Deco framing detail at TE.BRA bar in Chersonissos" loading="lazy" className="aspect-[4/5] w-full rounded-md object-cover" />
        </div>
      </div>
    </section>
  );
}

// ---------- Gallery (swipeable + auto-scroll) ----------
function Gallery() {
  const row = useMemo(() => [...GALLERY, ...GALLERY], []);
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const pausedRef = useRef(false);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    let rafId = 0;
    let last = performance.now();
    const speed = 30; // px per second — subtle, natural feel

    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      if (!pausedRef.current && el) {
        el.scrollLeft += (speed * dt) / 1000;
        // seamless loop — the row is doubled, so reset at halfway
        const half = el.scrollWidth / 2;
        if (el.scrollLeft >= half) el.scrollLeft -= half;
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    const pause = () => (pausedRef.current = true);
    const resume = () => {
      // small delay after touch/mouse leaves so it doesn't jerk back to auto
      window.setTimeout(() => (pausedRef.current = false), 1500);
    };

    el.addEventListener("pointerdown", pause);
    el.addEventListener("pointerup", resume);
    el.addEventListener("pointercancel", resume);
    el.addEventListener("mouseenter", pause);
    el.addEventListener("mouseleave", resume);
    el.addEventListener("touchstart", pause, { passive: true });
    el.addEventListener("touchend", resume, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      el.removeEventListener("pointerdown", pause);
      el.removeEventListener("pointerup", resume);
      el.removeEventListener("pointercancel", resume);
      el.removeEventListener("mouseenter", pause);
      el.removeEventListener("mouseleave", resume);
      el.removeEventListener("touchstart", pause);
      el.removeEventListener("touchend", resume);
    };
  }, []);

  return (
    <section aria-label="Gallery inside TE.BRA sports bar in Hersonissos, Crete" className="relative overflow-hidden border-t border-gold/10 py-16">
      <FadeUp>
        <p className="label-eyebrow text-center">Inside TE.BRA · Hersonissos · Crete</p>
      </FadeUp>
      <div
        ref={scrollerRef}
        className="mt-8 flex gap-4 overflow-x-auto overflow-y-hidden scroll-smooth px-4 pb-2 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ touchAction: "pan-x", overscrollBehaviorX: "contain" }}
      >
        {row.map((g, i) => (
          <img
            key={i}
            src={g.src}
            alt={g.alt}
            loading="lazy"
            draggable={false}
            className="h-56 w-80 flex-none select-none rounded-md object-cover md:h-72 md:w-96"
          />
        ))}
      </div>
      <p className="mt-3 text-center text-[11px] uppercase tracking-[0.2em] text-ivory-dim/70">Swipe to explore →</p>
    </section>
  );
}

// ---------- Reviews ----------
type SortMode = "recent" | "rating";

function Reviews() {
  const seedSummary = getSummary();
  const seedReviews = useMemo(() => getReviews(), []);

  // Auto-refresh from Tripadvisor via Firecrawl every 30 min; falls back to seed.
  const { data } = useQuery({
    queryKey: ["tripadvisor-reviews"],
    queryFn: () => getLiveReviews(),
    initialData: { summary: seedSummary, reviews: seedReviews, fetchedAt: "", source: "seed" as const },
    staleTime: 30 * 60 * 1000,
    refetchInterval: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const summary = data.summary;
  // Only publish the best guest reviews: five star, with real wording.
  const all = useMemo(
    () => data.reviews.filter((r) => r.rating >= 5 && r.snippet.trim().length > 20),
    [data.reviews],
  );
  const [sort, setSort] = useState<SortMode>("recent");
  const [showAll, setShowAll] = useState(false);

  const sorted = useMemo(() => {
    const list = [...all].sort((a, b) => (a.date < b.date ? 1 : -1));
    if (sort === "rating") list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [all, sort]);

  const visible = showAll ? sorted : sorted.slice(0, 6);

  const newestIds = useMemo(() => {
    const byDate = [...all].sort((a, b) => (a.date < b.date ? 1 : -1)).filter(r => Date.now() - Date.parse(r.date) <= 30 * 86400000).slice(0, 3);
    return new Set(byDate.map((r) => `${r.name}-${r.date}`));
  }, [all]);

  return (
    <section id="reviews" className="relative border-t border-gold/10 py-16 md:py-32">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <FadeUp>
          <header className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl leading-tight text-ivory sm:text-4xl md:text-5xl">
              {summary.rating.toFixed(1)} out of 5 from{" "}
              <span className="text-gold-gradient italic">{summary.total} reviews</span>
              <span className="block text-ivory-dim">for the best sports bar in Hersonissos, Crete</span>
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
            <p className="mt-5 text-[15px] leading-relaxed text-ivory-dim">
              Guests in Chersonisos rate us five stars for the welcome, the cocktails and every match on the big
              screens. Read the full guest reviews on Tripadvisor.
            </p>
          </header>
        </FadeUp>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-2 text-xs uppercase tracking-[0.2em] text-ivory-dim sm:justify-end">
          <span>Sort by</span>
          <SortBtn active={sort === "recent"} onClick={() => setSort("recent")}>Most recent</SortBtn>
          <SortBtn active={sort === "rating"} onClick={() => setSort("rating")}>Highest rated</SortBtn>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((r, i) => (
            <motion.div
              key={`${r.name}-${r.date}-${i}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.08 }}
            >
              <ReviewCard r={r} isNew={newestIds.has(`${r.name}-${r.date}`)} />
            </motion.div>
          ))}
        </div>

        {!showAll && sorted.length > 6 && (
          <div className="mt-8 flex justify-center">
            <SortBtn active={false} onClick={() => setShowAll(true)}>
              Show more reviews
            </SortBtn>
          </div>
        )}

        <div className="mt-12 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <BtnPrimary href={whatsappUrl("Hi TE.BRA, I would like to book a table.")} target="_blank" rel="noopener">
            Book your table on WhatsApp
          </BtnPrimary>
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
    { q: "Where is TE.BRA in Hersonissos?", a: "A short drive from the main strip, in a quieter, nicer setting near the villas. Directions link below." },
    { q: "Does TE.BRA have good cocktails?", a: "Yes, handcrafted cocktails with generous measures are the specialty, alongside premium spirits, beer and wine." },
    { q: "Can I watch football and live sport at TE.BRA?", a: "Yes, multiple large screens show football, Champions League and major live sport. Ask us to put your match on." },
    { q: "Can I reserve a table for a big match?", a: "Message us on WhatsApp with the match, date and party size. Your request becomes a reservation once our team confirms screening and availability." },
    { q: "What games are there?", a: "A pool table and darts, and a relaxed space to settle in." },
    { q: "Does TE.BRA serve food?", a: "Yes, breakfast, snacks and bar food throughout the day." },
    { q: "What are the opening hours?", a: "Open daily from 11:00 until late." },
  ];
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="relative border-t border-gold/10 py-16 md:py-32">
      <div className="mx-auto max-w-3xl px-4 md:px-8">
        <FadeUp>
          <p className="label-eyebrow text-center">FAQ</p>
          <h2 className="mt-4 text-center font-display text-3xl leading-tight text-ivory sm:text-4xl md:text-5xl">
            Good to <span className="text-gold-gradient italic">know</span>.
          </h2>
        </FadeUp>
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
                  <span className="font-display text-base text-ivory sm:text-lg md:text-xl">{it.q}</span>
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
    <section id="find-us" className="relative border-t border-gold/10 py-16 md:py-32">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <FadeUp>
          <p className="label-eyebrow text-center">Find us</p>
          <h2 className="mt-4 text-center font-display text-3xl leading-tight text-ivory sm:text-4xl md:text-5xl">
            Come <span className="text-gold-gradient italic">say hello</span>.
          </h2>
        </FadeUp>

        <div className="mt-14 grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          <FadeUp>
            <div className="deco-frame overflow-hidden">
              <img
                src={EXTERIOR_DUSK}
                alt="TE.BRA sports bar exterior at dusk in Hersonissos, Crete"
                loading="lazy"
                className="h-56 w-full object-cover"
              />
              <iframe
                title="TE.BRA Sports Bar on Google Maps"
                src={mapEmbed}
                className="h-[360px] w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </FadeUp>
          <FadeUp delay={0.15}>
            <div className="flex h-full flex-col justify-between">
              <div>
                <h3 className="font-display text-xl text-ivory sm:text-2xl">TE.BRA Sports Bar</h3>
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
          </FadeUp>
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
        <img src={LOGO} alt="TE.BRA gold crest" className="h-16 w-16 object-contain" />
        <p className="font-display text-lg italic text-ivory-dim">
          Live sport, cocktails and a warm welcome in Hersonissos.
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
  const telHref = `tel:${CONFIG.phone.replace(/\s/g, "")}`;
  return (
    <div className="pb-safe fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 gap-2 border-t border-gold/25 bg-background/95 px-3 pt-3 backdrop-blur-md md:hidden">
      <a
        href={telHref}
        aria-label="Call TE.BRA"
        className="inline-flex flex-col items-center justify-center gap-0.5 rounded-md border border-gold/40 px-2 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-ivory active:scale-95"
      >
        <IconPhone className="h-4 w-4 text-gold" />
        Call
      </a>
      <a
        href={whatsappUrl("Hi TE.BRA, quick question")}
        target="_blank"
        rel="noopener"
        aria-label="WhatsApp TE.BRA"
        className="inline-flex flex-col items-center justify-center gap-0.5 rounded-md border border-gold/40 px-2 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-ivory active:scale-95"
      >
        <IconWhatsapp className="h-4 w-4 text-gold" />
        WhatsApp
      </a>
      <a
        href={directionsUrl}
        target="_blank"
        rel="noopener"
        className="inline-flex flex-col items-center justify-center gap-0.5 rounded-md bg-gold-gradient px-2 py-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-background shadow-[0_10px_30px_-10px_rgba(201,162,75,0.6)] active:scale-95"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21s-7-7.5-7-12a7 7 0 0114 0c0 4.5-7 12-7 12z"/><circle cx="12" cy="9" r="2.5" fill="currentColor"/></svg>
        Directions
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
function IconHeart() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M12 21s-7-4.5-9.5-9A5 5 0 0112 6a5 5 0 019.5 6C19 16.5 12 21 12 21z" />
    </svg>
  );
}
function IconLeaf() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M5 21c8 0 14 6 14 14M20 4c0 8 6 14 14 14" transform="translate(-9 -13) scale(0.9)" />
      <path d="M4 20c8 0 16-8 16-16-8 0-16 8-16 16z" />
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
function IconDart() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      <path d="M12 12l8-8" />
    </svg>
  );
}
function IconDice() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <circle cx="8" cy="8" r="1" fill="currentColor" />
      <circle cx="16" cy="8" r="1" fill="currentColor" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
      <circle cx="8" cy="16" r="1" fill="currentColor" />
      <circle cx="16" cy="16" r="1" fill="currentColor" />
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

