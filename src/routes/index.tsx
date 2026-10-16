import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useScroll, useTransform, useInView } from "motion/react";
import { useQuery } from "@tanstack/react-query";
import { getReviews, getSummary, type Review } from "@/lib/reviews";
import { getLiveReviews } from "@/lib/reviews.functions";
import { HomeLiveSports } from "@/components/home-live-sports";
import { VERIFIED_SPORTS_PROGRAMME } from "@/lib/verified-sports-programme";

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
const SCREENS = realPoolCrowd.url;                // Real guests gathered at Tebra
const POOL_DARTS = realPoolCrowd.url;               // real pool + crowd watching sport
const FOOD = "/photos/tebra-pizza.jpg";                     // real group enjoying food
const DRINK_2 = realBarCocktails.url;               // real bar with fruit + spirits
const DETAIL_1 = img36.url;
const DETAIL_2 = img38.url;

const GALLERY = [
  { src: img25.url, alt: "Cocktails at the Tebra bar", category: "The space" },
  { src: "/photos/lounge-match-guests.jpg", alt: "Match night in the lounge", category: "Our guests" },
  { src: "/photos/zac-football-guests.jpg", alt: "Zac and our football guests", category: "Our guests" },
  { src: "/photos/welcome-sign.webp", alt: "Everyone is welcome", category: "The space" }
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
  { href: "/sports-desk", label: "Live Sport" },
  { href: "#food", label: "Food & Drinks" },
  { href: "#gallery", label: "The Bar" },
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
      { title: "Tebra | Cocktail & Sports Bar in Hersonissos, Crete" },
      { name: "description", content: "Cocktails, live sport, pool, darts and food at Tebra Sports Bar in Hersonissos, Crete. Open daily." },
      { property: "og:title", content: "Tebra | Cocktail & Sports Bar in Hersonissos, Crete" },
      { property: "og:description", content: "Cocktails, live sport, pool, darts and food at Tebra Sports Bar in Hersonissos, Crete." },
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
    <div className="min-h-screen bg-background text-ivory [&_section[id]]:scroll-mt-20 [&_h1]:font-sans [&_h2]:font-sans [&_h3]:font-sans [&_h1]:font-semibold [&_h2]:font-semibold [&_h3]:font-semibold [&_h2]:tracking-tight">
      <Header />
      <main id="top">
        <HomeLiveSports fixtures={VERIFIED_SPORTS_PROGRAMME} requestUrl={whatsappUrl} />
        <FacadePhoto />
        <Reviews />
        <LoungeStory />
        <AtmosphereVideo />
        <Food />
        <CocktailStory />
        <Games />
        <Gallery />
        <Sport />
        <HostStory />
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
      <div className="mx-auto flex h-[84px] max-w-7xl items-center justify-between px-4 md:px-8">
        <a href="#top" className="flex shrink-0 items-center gap-2">
          <img src={LOGO} alt="Tebra Sports Bar gold crest logo" className="hidden h-12 w-12 object-contain sm:block" />
          <span className="flex min-w-0 flex-col"><span className="font-sans text-[32px] font-black leading-none tracking-[0.045em] text-ivory sm:text-[38px]">TEBRA</span><span className="mt-1.5 text-[11px] font-extrabold uppercase leading-tight tracking-[0.035em] text-gold sm:text-[13px]">Premium Sports Bar</span></span>
        </a>

        <nav className="hidden items-center gap-5 lg:flex" aria-label="Primary">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className="link-sweep text-sm text-ivory-dim hover:text-ivory">
              {n.label}
            </a>
          ))}
          <Link to="/active" className="link-sweep text-xs font-semibold text-gold">
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
            href={whatsappUrl("Hi Tebra")}
            target="_blank"
            rel="noopener"
            aria-label="Message on WhatsApp"
            className="rounded-md border border-gold/40 p-3 text-gold hover:bg-gold/10 md:hidden"
          >
            <IconWhatsapp className="h-5 w-5" />
          </a>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="rounded-md border border-gold/40 p-3 text-ivory lg:hidden"
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


function LoungeStory() {
  return <section id="lounge" className="border-y border-gold/15 bg-[#EEE9DE] py-14 text-[#20251F] md:py-20">
    <div className="mx-auto grid max-w-7xl items-center gap-9 px-5 md:grid-cols-[1.25fr_1fr] md:gap-16 md:px-8">
      <img src="/photos/match-night-guests.jpg" alt="Guests enjoying an evening of football at Tebra" loading="lazy" className="aspect-[4/3] w-full rounded-lg object-cover object-bottom" />
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#716044]">LIVE SPORT. TEBRA COMFORT.</p>
        <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight md:text-4xl">The match brings you in.<br />The welcome brings you back.</h2>
        <p className="mt-5 text-base leading-7 text-[#555C50]">Your team, your friends and a room full of good company. Settle into the lounge, join us around the pool table and make an evening of it.</p>
        <p className="mt-4 text-base leading-7 text-[#555C50]">Zac and Valentina welcome you to Tebra — your home away from home in Hersonissos.</p>
        <a href="#sport" className="mt-7 inline-flex min-h-12 items-center rounded-md bg-[#20251F] px-6 text-sm font-semibold text-[#FAF6EC]">Plan your visit ↗</a>
      </div>
    </div>
  </section>;
}

function CocktailStory() {
  return <section id="drinks" className="border-t border-gold/15 py-14 md:py-20">
    <div className="mx-auto max-w-7xl px-5 md:px-8">
      <header className="mb-8 grid items-end gap-5 md:grid-cols-2">
        <div><p className="label-eyebrow">AT THE BAR</p><h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">A proper cocktail.<br />Your kind of evening.</h2></div>
        <p className="max-w-lg text-base leading-7 text-ivory-dim">Cocktails, cold beers, wine and alcohol-free choices. From the first coffee to a drink after the final whistle.</p>
      </header>
      <div className="grid gap-5 md:grid-cols-3">
        <figure className="overflow-hidden rounded-lg border border-gold/15"><img src={img10.url} alt="A signature cocktail at Tebra" loading="lazy" className="aspect-[4/3] w-full bg-black object-contain p-3" /><figcaption className="p-5 text-lg font-semibold">Cocktails, made for your evening</figcaption></figure>
        <figure className="overflow-hidden rounded-lg border border-gold/15"><img src={realBarCocktails.url} alt="The Tebra bar with fresh fruit and spirits" loading="lazy" className="aspect-[4/3] w-full object-cover" /><figcaption className="p-5 text-lg font-semibold">A warm welcome at the bar</figcaption></figure>
        <a href="/active" className="flex min-h-64 flex-col justify-center rounded-lg border border-gold/25 bg-[#1C231D] p-7"><p className="label-eyebrow">TEBRA ACTIVE</p><h3 className="mt-5 text-3xl font-semibold text-ivory">More choice.<br />Same Tebra.</h3><p className="mt-4 text-sm leading-6 text-ivory-dim">Explore our smoothie and protein line.</p><span className="mt-7 text-sm font-semibold text-gold">Discover Active ↗</span></a>
      </div>
      <a href={CONFIG.menuUrl} target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex min-h-12 items-center rounded-md border border-gold/40 px-6 text-sm font-semibold">View the menu ↗</a>
    </div>
  </section>;
}

function VisitorGuide() {
  return <section id="guide" className="border-y border-gold/15 bg-[#1C231D] py-14 md:py-20">
    <div className="mx-auto grid max-w-7xl items-center gap-8 px-5 md:grid-cols-[1fr_auto] md:px-8">
      <div><p className="label-eyebrow">TEBRA VISITOR GUIDE · COMING SOON</p><h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">Your stay. With a Tebra welcome.</h2><p className="mt-5 max-w-2xl text-base leading-7 text-ivory-dim">Useful information for your time in Hersonissos: beaches, transport, days out and live sport. Our visitor guide is being prepared.</p></div>
      <div className="flex flex-wrap gap-2 text-sm text-ivory-dim md:max-w-60"><span className="rounded-full border border-gold/25 px-4 py-2">Beaches</span><span className="rounded-full border border-gold/25 px-4 py-2">Transport</span><span className="rounded-full border border-gold/25 px-4 py-2">Days out</span><span className="rounded-full border border-gold/25 px-4 py-2">Live sport</span></div>
    </div>
  </section>;
}

// ---------- Hero ----------
function Hero() {
  return (
    <section id="top" className="relative overflow-hidden border-b border-gold/15 bg-[#111311]">
      <div className="mx-auto grid max-w-7xl items-center gap-0">
        <div className="order-1 px-5 py-5 sm:px-10 md:py-7 lg:px-14 lg:py-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#E7C77F]">Hersonissos · Crete</p>
          <p className="mt-2 text-sm font-bold uppercase tracking-[0.14em] text-[#FAF6EC]">TEBRA PREMIUM SPORTS BAR</p>
          <h1 className="mt-3 max-w-xl font-sans text-[30px] font-semibold leading-[1.12] tracking-[-0.035em] text-[#FAF6EC] sm:text-[40px] lg:text-[48px]">
            Your match. Your people. <span className="text-[#E7C77F]">Your place.</span>
          </h1>
          <p className="mt-3 max-w-md text-[16px] leading-[1.75] text-[#D5D4CD]">
            Live sport. Premium cocktails. Your home away from home.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
            <a href="#live-sports" className="inline-flex min-h-12 items-center justify-center rounded-md bg-[#E7C77F] px-6 text-sm font-semibold text-[#111311] transition-colors hover:bg-[#F2DDA7]">Explore live sport ↗</a>
            <a href={whatsappUrl("Hi Tebra, I would like to request a table. Please confirm availability.")} target="_blank" rel="noopener" className="inline-flex min-h-12 items-center justify-center rounded-md border border-[#E7C77F]/50 px-6 text-sm font-semibold text-[#FAF6EC] transition-colors hover:bg-white/5">Request a table</a>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3 text-xs text-[#D5D4CD]">
            <a href={directionsUrl} target="_blank" rel="noopener" className="underline decoration-[#E7C77F]/50 underline-offset-4">Find us ↗</a>
            <a href={getSummary().tripadvisorUrl} target="_blank" rel="noopener" className="underline decoration-[#E7C77F]/50 underline-offset-4">Guest reviews ↗</a>
            <span>Hersonissos, Crete</span>
          </div>
        </div>
        
      </div>
    </section>
  );
}

function FacadePhoto() {
  return <section aria-label="The Tebra facade" className="border-b border-gold/15 bg-[#111311] px-4 py-8 md:px-8 md:py-12"><div className="mx-auto max-w-7xl">
          <figure className="overflow-hidden rounded-xl border border-[#E7C77F]/20 bg-[#1B1D19] shadow-2xl">
            <img src={realExteriorNight.url} alt="The illuminated facade and welcoming lounge of Tebra Premium Sports Bar in Hersonissos" width={1368} height={1028} fetchPriority="high" className="block h-auto w-full" />
            <figcaption className="flex items-center justify-between gap-3 border-t border-[#E7C77F]/15 px-5 py-4">
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#E7C77F]">Your home away from home</span>
              <span className="text-xs text-[#D5D4CD]">Tebra, Crete</span>
            </figcaption>
          </figure></div></section>;
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
function SportsBanner() {
  const experiences = [
    { title: "Watch", description: "Find your fixture. Request your table.", image: SCREENS, alt: "Guests watching sport at Tebra", href: "#live-sports", action: "Explore the programme" },
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
          <a href={s.tripadvisorUrl} target="_blank" rel="noopener">Tripadvisor reviews ↗</a>
        </div>
        <span className="hidden h-4 w-px bg-gold/25 md:inline" />
        <span className="label-eyebrow">#1 of 25 Nightlife in Hersonissos · Tripadvisor</span>
        <div className="flex items-center gap-3"><span className="font-display text-2xl text-ivory">5.0</span><GoldStars n={5} size={16} /><a href="https://maps.app.goo.gl/BKm2gsfkUKHxqGo67" target="_blank" rel="noopener">Google reviews ↗</a></div>
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
    <section id="cocktails" className="relative py-16 md:py-20">
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
                alt="Signature cocktail on the bar at Tebra cocktail bar Hersonissos"
                loading="lazy"
                className="aspect-[4/5] w-full rounded-md object-cover"
              />
              <motion.img
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.5 }}
                src={DRINK_2}
                alt="Handcrafted cocktail poured at Tebra bar in Hersonissos, Crete"
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
  const [preview, setPreview] = useState<string | null>(null);
  useEffect(() => setPreview(null), [match, party, when]);

  const message = useMemo(() => {
    const m = match || "the match";
    const w = when ? `${when.replace("T", " ")} Greek time` : "date and time";
    return `Hi Tebra, I would like to request a table for ${m.trim()} on ${w}, for ${party} people. Please confirm the screening and table availability.`;
  }, [match, party, when]);

  return (
    <section id="sport" className="relative border-t border-gold/10 py-20 md:py-20">
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
            Tell us your match, date and group size. We will confirm whether we can show it and whether a table is available.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <BtnPrimary href={whatsappUrl(message)} target="_blank" rel="noopener">
              <IconWhatsapp className="h-4 w-4" /> Request on WhatsApp
            </BtnPrimary>
            <BtnOutline href={`tel:${CONFIG.phone.replace(/\s/g, "")}`}>Call us</BtnOutline>
          </div>
          <p className="mt-6 text-xs uppercase tracking-[0.24em] text-ivory-dim">
            Please arrive 15–20 minutes before your confirmed match.
          </p>
        </FadeUp>

        <FadeUp delay={0.15}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const data = new FormData(e.currentTarget);
              const event = String(data.get("match") || "").trim();
              const dateTime = String(data.get("when") || "").replace("T", " ");
              const guests = String(data.get("party") || "");
              if (!event || !dateTime || !Number.isInteger(Number(guests)) || Number(guests) < 1) return;
              setPreview(`Hi Tebra, I would like to request a table for ${event} on ${dateTime} Greek time, for ${guests} people. Please confirm the screening and table availability.`);
            }}
            className="deco-frame bg-surface-raised/70 p-6 md:p-8"
          >
            <p className="label-eyebrow">Request your table</p>
            <div className="mt-4 grid gap-4">
              <Field name="match" label="Which match?" value={match} onChange={setMatch} required maxLength={120} placeholder="e.g. Liverpool v Arsenal" />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field name="when" label="Date & time · Greece" value={when} onChange={setWhen} type="datetime-local" required />
                <Field name="party" label="Party size" value={party} onChange={setParty} type="number" min={1} step={1} required />
              </div>
              <button
                type="submit"
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-md bg-gold-gradient px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-background transition-transform hover:-translate-y-0.5"
              >
                Preview your request
              </button>
              {preview && <div className="min-w-0 rounded-md border border-gold/25 bg-background/60 p-4" role="status" aria-live="polite">
                <p className="break-words text-sm leading-relaxed text-ivory">{preview}</p>
                <a href={whatsappUrl(preview)} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex min-h-12 w-full items-center justify-center rounded-md bg-gold-gradient px-4 py-3 text-center text-sm font-semibold text-background">Continue to WhatsApp ↗</a>
                <p className="mt-3 text-xs leading-relaxed text-ivory-dim">Send your request in WhatsApp. Your table and screening are confirmed only when Tebra replies.</p>
              </div>}
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
    { icon: <IconDice />, title: "and more", body: "Ask us what is available during your visit." },
  ];
  return (
    <section id="games" className="relative py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <FadeUp>
            <p className="label-eyebrow">Between the matches</p>
            <h2 className="mt-4 font-display text-3xl leading-tight text-ivory sm:text-4xl md:text-5xl">
              Play a little, <span className="text-gold-gradient italic">settle in</span>.
            </h2>
            <p className="mt-5 max-w-md text-ivory-dim">
              A game of pool, a round of darts and another reason to stay a little longer.
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
                alt="Pool table and games area at Tebra sports bar Hersonissos Crete"
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
    <section id="food" className="relative border-t border-gold/10 py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <FadeUp>
            <motion.img
              initial={{ scale: 1.05 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, ease: "easeOut" }}
              src={FOOD}
              alt="Pizza served at Tebra Premium Sports Bar"
              loading="lazy"
              className="aspect-[4/3] w-full rounded-md object-cover object-center"
            />
            <div className="mt-4 grid gap-4 sm:grid-cols-2"><figure className="overflow-hidden rounded-md border border-gold/15"><img src="/photos/tebra-breakfast.jpg" alt="Breakfast with omelettes, croissants and bread at Tebra" loading="lazy" className="aspect-[4/3] w-full object-cover object-bottom" /><figcaption className="px-4 py-3 text-sm text-ivory-dim">Breakfast, with a Tebra welcome.</figcaption></figure><figure className="overflow-hidden rounded-md border border-gold/15"><img src="/photos/zac-breakfast-welcome.jpg" alt="Zac welcoming guests to a breakfast table at Tebra" loading="lazy" className="aspect-[3/4] w-full object-cover" /><figcaption className="px-4 py-3 text-sm text-ivory-dim">Your breakfast. Your host.</figcaption></figure></div>
          </FadeUp>
          <FadeUp delay={0.15}>
            <p className="label-eyebrow">Food</p>
            <h2 className="mt-4 font-display text-3xl leading-tight text-ivory sm:text-4xl md:text-5xl">
              Good food, <span className="text-gold-gradient italic">all day</span>.
            </h2>
            <p className="mt-5 max-w-md text-ivory-dim">
              Start with coffee and breakfast. Come back for pizza, bar bites and a drink with your match.
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
    <section id="experience" className="relative py-16 md:py-20">
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
          <motion.img whileHover={{ scale: 1.03 }} transition={{ duration: 0.5 }} src={LOUNGE_1} alt="Deco lounge seating inside Tebra sports bar Hersonissos" loading="lazy" className="aspect-[4/5] w-full rounded-md object-cover" />
          <motion.img whileHover={{ scale: 1.03 }} transition={{ duration: 0.5 }} src={DETAIL_1} alt="Champagne gold detail at Tebra cocktail bar Hersonissos" loading="lazy" className="aspect-[4/5] w-full rounded-md object-cover" />
          <motion.img whileHover={{ scale: 1.03 }} transition={{ duration: 0.5 }} src={LOUNGE_2} alt="Comfortable seating and warm lighting at Tebra" loading="lazy" className="aspect-[4/5] w-full rounded-md object-cover" />
          <motion.img whileHover={{ scale: 1.03 }} transition={{ duration: 0.5 }} src={DETAIL_2} alt="Deco framing detail at Tebra bar in Hersonissos" loading="lazy" className="aspect-[4/5] w-full rounded-md object-cover" />
        </div>
      </div>
    </section>
  );
}

// ---------- Curated venue gallery ----------
function AtmosphereVideo() {
  return <section id="atmosphere" className="border-t border-gold/15 py-14 md:py-20">
    <div className="mx-auto max-w-6xl px-5 md:px-8">
      <p className="label-eyebrow">A MOMENT AT TEBRA</p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">Step inside. Feel the atmosphere.</h2>
      <p className="mt-4 max-w-2xl text-base leading-7 text-ivory-dim">A game of pool, live sport on the screens and good company in the lounge. A glimpse of life at Tebra Premium Sports Bar.</p>
      <video controls playsInline preload="none" poster="/photos/tebra-video-poster.jpg" className="mt-7 aspect-[9/16] max-h-[620px] w-full max-w-sm mx-auto rounded-lg border border-gold/20 bg-black" aria-label="Video of guests and the lounge at Tebra Premium Sports Bar">
        <source src="/photos/tebra-atmosphere.mp4" type="video/mp4" />
        Your browser does not support video. <a href="/photos/tebra-atmosphere.mp4">Open the Tebra video.</a>
      </video>
    </div>
  </section>;
}

function Gallery() {
  const [filter, setFilter] = useState("All photos");
  const [active, setActive] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const visible = GALLERY.filter(g => filter === "All photos" || g.category === filter);
  useEffect(() => {
    const dialog = dialogRef.current;
    if (active !== null) dialog?.showModal();
    else dialog?.close();
    if (active === null) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [active]);
  const move = (step: number) => setActive(index => index === null ? null : (index + step + GALLERY.length) % GALLERY.length);
  return (
    <section id="gallery" aria-label="Tebra photo gallery" className="border-t border-gold/10 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <header className="mb-8 max-w-2xl">
          <p className="label-eyebrow">THE TEBRA EXPERIENCE</p>
          <h2 className="mt-3 font-display text-4xl text-ivory md:text-5xl">See the place. Feel the welcome.</h2>
          <p className="mt-4 text-lg text-ivory-dim">Daylight comfort, big match moments and good company in Hersonissos.</p>
        </header>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
          {visible.map((g, i) => (
            <button type="button" key={g.src} onClick={() => setActive(GALLERY.indexOf(g))}
              aria-label={`Open photo: ${g.alt}`}
              className={`group relative overflow-hidden rounded-xl border border-gold/15 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold ${i === 0 ? "col-span-2 row-span-2" : ""}`}>
              <img src={g.src} alt={g.alt} loading="lazy" width="1600" height="1200"
                className={`h-full w-full ${g.src === img10.url ? "bg-black object-contain p-3" : "object-cover"} transition-transform duration-500 motion-reduce:transition-none ${g.src === img10.url ? "" : "group-hover:scale-105"} ${i === 0 ? "aspect-square" : "aspect-[4/3]"}`} />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent px-4 pb-4 pt-12 text-sm font-semibold text-white md:text-base">{g.alt}</span>
            </button>
          ))}
        </div>
        <p className="mt-4 text-sm text-ivory-dim">Tap any photo to explore.</p>
      </div>
      <dialog ref={dialogRef} aria-label="Enlarged Tebra photograph" onCancel={() => setActive(null)} onClick={e => { if (e.target === e.currentTarget) setActive(null); }}
        onKeyDown={e => { if (e.key === "ArrowRight") move(1); if (e.key === "ArrowLeft") move(-1); }}
        className="fixed inset-0 m-auto max-h-[95dvh] w-[96vw] max-w-6xl overflow-auto rounded-xl border border-gold/30 bg-black p-3 text-white backdrop:bg-black/90">
        {active !== null && <>
          <div className="mb-3 flex items-center justify-between gap-4">
            <p className="font-semibold">{GALLERY[active].alt}</p>
            <button type="button" autoFocus onClick={() => setActive(null)} className="min-h-12 min-w-12 rounded-lg border border-white/30 px-4" aria-label="Close photo">Close ×</button>
          </div>
          <img src={GALLERY[active].src} alt={GALLERY[active].alt} className="max-h-[72dvh] w-full object-contain" />
          <div className="mt-3 flex items-center justify-between">
            <button type="button" onClick={() => move(-1)} className="min-h-12 rounded-lg border border-white/30 px-4">← Previous</button>
            <span>{active + 1} / {GALLERY.length}</span>
            <button type="button" onClick={() => move(1)} className="min-h-12 rounded-lg border border-white/30 px-4">Next →</button>
          </div>
        </>}
      </dialog>
    </section>
  );
}

// ---------- Reviews ----------
type SortMode = "recent" | "rating";

function Reviews() {
  const platforms = [
    { name: "Tripadvisor", href: getSummary().tripadvisorUrl, description: "Read our guests’ experiences on Tripadvisor." },
    { name: "Google", href: "https://maps.app.goo.gl/BKm2gsfkUKHxqGo67", description: "Read guest reviews and find Tebra on Google Maps." },
    { name: "Restaurant Guru", href: "https://restaurantguru.com/TEBRA-Sports-Bar-Chersonisos", description: "Explore the Tebra listing on Restaurant Guru." },
  ];
  return (
    <section id="reviews" className="border-t border-gold/10 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <header className="mx-auto max-w-2xl text-center">
          <p className="label-eyebrow">Our guests’ experiences</p>
          <a href={getSummary().tripadvisorUrl} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex flex-col gap-2 rounded-lg border border-gold/40 bg-gold/10 px-6 py-5"><span className="text-xl font-semibold text-gold md:text-2xl">#1 of 25 Nightlife in Hersonissos</span><span className="text-sm text-ivory">Tripadvisor · Bars &amp; Clubs · 5.0 / 5</span><span className="text-xs text-ivory-dim">Ranking checked 12 October 2026 · View current ranking ↗</span></a>
          <h2 className="mt-4 font-display text-3xl text-ivory md:text-5xl">Read them in their own words.</h2>
          <p className="mt-5 text-ivory-dim">The welcome, the atmosphere and the moments that bring people back. Visit our profiles for the latest reviews and ratings.</p>
        </header>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {platforms.map(platform => <a key={platform.name} href={platform.href} target="_blank" rel="noopener" className="deco-frame block bg-surface-raised/70 p-6 transition-colors hover:border-gold/60">
            <h3 className="text-xl font-semibold text-ivory">{platform.name} ↗</h3>
            <p className="mt-4 text-sm leading-relaxed text-ivory-dim">{platform.description}</p>
          </a>)}
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
    { q: "Where is Tebra in Hersonissos?", a: "We are in Hersonissos, Crete. Use the directions link below to find the bar and plan your route." },
    { q: "Does Tebra have good cocktails?", a: "Yes, handcrafted cocktails with generous measures are the specialty, alongside premium spirits, beer and wine." },
    { q: "Can I watch football and live sport at Tebra?", a: "We show live sport on multiple screens. Send us your match and date so we can confirm broadcast availability before you visit." },
    { q: "Can I reserve a table for a big match?", a: "Message us on WhatsApp with the match, date and party size. Your request becomes a reservation once our team confirms screening and availability." },
    { q: "What games are there?", a: "A pool table and darts, and a relaxed space to settle in." },
    { q: "Does Tebra serve food?", a: "Yes, breakfast, snacks and bar food throughout the day." },
    { q: "What are the opening hours?", a: "Open daily from 11:00 until late." },
  ];
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="relative border-t border-gold/10 py-16 md:py-20">
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


function HostStory() {
  return <section id="your-host" aria-labelledby="host-title" className="border-t border-gold/15 bg-[#EEE9DE] py-14 text-[#20251F] md:py-20">
    <div className="mx-auto grid max-w-5xl items-center gap-9 px-5 md:grid-cols-[0.8fr_1.2fr] md:gap-14 md:px-8">
      <figure className="mx-auto w-full max-w-sm overflow-hidden rounded-lg border border-[#716044]/20">
        <img src="/photos/zeljko-zac.jpg" alt="Željko, known to Tebra guests as Zac, owner and host" width={755} height={755} loading="lazy" className="block h-auto w-full" />
        <figcaption className="bg-[#20251F] px-5 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#E7C77F]">Zac · Founder & host</figcaption>
      </figure>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#716044]">THE PEOPLE BEHIND TEBRA</p>
        <h2 id="host-title" className="mt-4 text-3xl font-semibold leading-tight tracking-tight md:text-4xl">A welcome from Zac.</h2>
        <p className="mt-5 text-base leading-7 text-[#555C50]">I’m Željko — <strong>Zac to my friends</strong> — founder of <strong>Tebra Premium Sports Bar</strong> and the <strong>Hersonissos visitor guide</strong>. Originally from Serbia, <strong>Greece has been my home for almost two decades</strong>. My extensive experience in hospitality has shaped my approach: quality service, attention to detail and a personal connection with our guests.</p>
        <p className="mt-4 text-base leading-7 text-[#555C50]">Together with my wife Valentina, I am developing a place that brings together live sport, great cocktails and hospitality. We are proud of the trust we have built and the guests who return to us.</p>
        <div className="my-7 border-l-2 border-[#806024] bg-[#E5DECF] px-5 py-5"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#806024]">THE MEANING OF TEBRA</p><p className="mt-3 text-base leading-7 text-[#20251F]">The name <strong>Tebra</strong> comes from <strong>“brate”</strong>, meaning “brother” in my native Serbian, and represents <strong>closeness, friendship and togetherness</strong>. That is the spirit we want to share with every guest.</p></div>
        <p className="mt-4 text-base leading-7 text-[#555C50]">Today, we are <strong className="text-[#20251F]">ranked #1 of 25 nightlife venues in Hersonissos on Tripadvisor</strong>, in the <strong>Bars &amp; Clubs</strong> category. Our guests’ reviews are the best reflection of the experience we offer.</p>
        <p className="mt-4 text-base leading-7 text-[#555C50]">Welcome. As your host, I’m here to help — with a reservation, a local recommendation or advice during your stay in Hersonissos.</p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <a href="tel:+306993399000" className="inline-flex min-h-12 items-center justify-center rounded-md bg-[#20251F] px-5 text-sm font-semibold text-[#FAF6EC]">Call Zac · +30 699 339 9000</a>
          <a href={whatsappUrl("Hi Zac, I would like to ask about visiting Tebra.")} target="_blank" rel="noopener" className="inline-flex min-h-12 items-center justify-center rounded-md border border-[#716044]/50 px-5 text-sm font-semibold text-[#20251F]">Message on WhatsApp ↗</a>
        </div>
      </div>
    </div>
  </section>;
}

// ---------- Find us ----------
function FindUs() {
  return (
    <section id="find-us" className="relative border-t border-gold/10 py-16 md:py-20">
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
                alt="Tebra sports bar exterior at dusk in Hersonissos, Crete"
                loading="lazy"
                className="h-56 w-full object-cover"
              />
              <iframe
                title="Tebra Sports Bar on Google Maps"
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
                <h3 className="font-display text-xl text-ivory sm:text-2xl">Tebra Sports Bar</h3>
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
                  <BtnOutline href={whatsappUrl("Hi Tebra")} target="_blank" rel="noopener">
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
        <img src={LOGO} alt="Tebra gold crest" className="h-16 w-16 object-contain" />
        <p className="font-display text-lg italic text-ivory-dim">
          Live sport, cocktails and a warm welcome in Hersonissos.
        </p>
        <div className="gold-hairline w-40" />
        <p className="text-xs uppercase tracking-[0.2em] text-ivory-dim">
          &copy; {new Date().getFullYear()} Tebra Sports Bar, Hersonissos, Crete
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
        href="/sports-desk"
        aria-label="Live sport at Tebra"
        className="inline-flex flex-col items-center justify-center gap-0.5 rounded-md border border-gold/40 px-2 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-ivory active:scale-95"
      >
        <IconDiamond />
        Live Sport
      </a>
      <a
        href={whatsappUrl("Hi Tebra, quick question")}
        target="_blank"
        rel="noopener"
        aria-label="WhatsApp Tebra"
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

