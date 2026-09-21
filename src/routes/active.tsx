import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, MessageCircle, MapPin, Phone } from "lucide-react";
import logoAsset from "@/assets/venue/logo.png.asset.json";

const LOGO = logoAsset.url;
const PHONE = "+30 699 339 9000";
const WHATSAPP = "https://wa.me/306993399000?text=Hi%20TE.BRA";
const DIRECTIONS = "https://www.google.com/maps/dir/?api=1&destination=35.31635468,25.387603686";

const PRODUCTS = [
  { code: "TA / 01", name: "KICK-OFF", type: "Tropical energy", description: "Mango, pineapple, orange and lime." },
  { code: "TA / 02", name: "FULL TIME", type: "Berry protein", description: "Berries and vanilla." },
  { code: "TA / 03", name: "POWER PLAY", type: "Choco protein", description: "Chocolate, peanut and banana." },
  { code: "TA / 04", name: "GREEN LIGHT", type: "Tropical green", description: "Mango, pineapple, greens, lime and ginger." },
  { code: "TA / 05", name: "TEBRA SUNRISE", type: "Signature protein", description: "Espresso, vanilla and banana. Non-alcoholic." },
];

export const Route = createFileRoute("/active")({
  head: () => ({
    meta: [
      { title: "TEBRA ACTIVE | A New Line by TE.BRA Sports Bar" },
      { name: "description", content: "Discover TEBRA ACTIVE, a new line by TE.BRA Sports Bar in Hersonissos with smoothies, protein blends and choices for every side of you." },
      { property: "og:title", content: "TEBRA ACTIVE | A New Line by TE.BRA Sports Bar" },
      { property: "og:description", content: "More choice. Same Tebra. Discover five TEBRA ACTIVE signature blends in Hersonissos, Crete." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://tebrabar.com/active" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "https://tebrabar.com/active" }],
  }),
  component: ActivePage,
});

function ActivePage() {
  return (
    <div className="tebra-active min-h-screen">
      <ActiveHeader />
      <main>
        <section className="active-hero">
          <div className="active-wrap">
            <p className="active-kicker">TEBRA PREMIUM BAR PRESENTS</p>
            <p className="active-brand">TEBRA <b>ACTIVE</b></p>
            <h1>More choice.<br />Same Tebra.</h1>
            <p className="active-lead">Beer, cocktails, smoothies or protein. Different choices, one table, same match.</p>
            <div className="active-tags" aria-label="TEBRA ACTIVE categories"><span>BAR</span><span>SPORT</span><span>ACTIVE</span></div>
          </div>
        </section>

        <div className="active-strip">
          <span>A NEW LINE BY TEBRA · EST. 2026</span>
          <b>TEBRA ACTIVE™</b>
          <span>One life. Two sides. One Tebra.</span>
        </div>

        <section className="active-statement active-wrap">
          <small>SPORT BRINGS US TOGETHER</small>
          <h2>Tebra is home for every side of you.</h2>
          <p>Train in the morning. Enjoy a cocktail at night. Watch the same match together. ACTIVE adds a modern choice without changing the Tebra people already love.</p>
        </section>

        <section className="active-duo active-wrap">
          <article><small>THE ORIGINAL SIGNATURE COCKTAIL</small><h3>TEBRA SUNSET</h3><p>Evening. Friends. Enjoyment.</p></article>
          <b>ONE TEBRA</b>
          <article><small>THE ACTIVE SIGNATURE</small><h3>TEBRA SUNRISE</h3><p>Energy. Protein. A new day.</p></article>
        </section>

        <section className="active-menu">
          <div className="active-wrap">
            <small>SIGNATURE BLENDS · 450 ML</small>
            <h2>Five names. Five clear choices.</h2>
            <div className="active-grid">
              {PRODUCTS.map((product) => (
                <article key={product.code}>
                  <i>{product.code}</i><h3>{product.name}</h3><b>{product.type}</b><p>{product.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <ActiveFooter />
      <ActiveMobileActions />
    </div>
  );
}

function ActiveHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="active-header">
      <div className="active-header-inner">
        <Link to="/" className="active-logo-link" aria-label="TE.BRA home">
          <img src={LOGO} alt="TE.BRA Sports Bar gold crest logo" />
          <span>TE.BRA</span>
        </Link>
        <nav className="active-desktop-nav" aria-label="Primary navigation">
          <Link to="/">Home</Link>
          <a href="#active-products">TEBRA ACTIVE</a>
          <a href={DIRECTIONS} target="_blank" rel="noopener">Find Us</a>
        </nav>
        <div className="active-header-actions">
          <a href={WHATSAPP} target="_blank" rel="noopener" className="active-whatsapp">WhatsApp</a>
          <button type="button" onClick={() => setOpen((value) => !value)} aria-label="Toggle menu" aria-expanded={open}>
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="active-mobile-nav" aria-label="Mobile navigation">
          <Link to="/" onClick={() => setOpen(false)}>Home</Link>
          <a href="#active-products" onClick={() => setOpen(false)}>TEBRA ACTIVE</a>
          <a href={DIRECTIONS} target="_blank" rel="noopener">Find Us</a>
        </nav>
      )}
    </header>
  );
}

function ActiveFooter() {
  return (
    <footer className="active-footer">
      <img src={LOGO} alt="TE.BRA gold crest" />
      <p>TEBRA PREMIUM BAR</p>
      <Link to="/">Return to Tebra</Link>
      <small>© {new Date().getFullYear()} TE.BRA Sports Bar, Hersonissos, Crete</small>
    </footer>
  );
}

function ActiveMobileActions() {
  return (
    <div className="active-mobile-actions">
      <a href={`tel:${PHONE.replace(/\s/g, "")}`}><Phone /><span>Call</span></a>
      <a href={WHATSAPP} target="_blank" rel="noopener"><MessageCircle /><span>WhatsApp</span></a>
      <a href={DIRECTIONS} target="_blank" rel="noopener"><MapPin /><span>Directions</span></a>
    </div>
  );
}