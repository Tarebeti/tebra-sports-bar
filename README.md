# TE.BRA Build

# TE.BRA Sports Bar — Lovable Build Prompt

Paste everything between the lines into Lovable. It's written as one build brief.
Placeholders you must fill are marked `[[LIKE THIS]]`.

---

Build a single page marketing website for **TE.BRA Sports Bar**, a premium sports bar and lounge in Hersonissos, Crete, Greece. Target audience: tourists and locals searching for a bar in Hersonissos / Chersonissos who want a stylish, upmarket spot to watch sport, drink good cocktails, and relax. The site must feel a notch more luxurious than a normal sports bar: think champagne gold on near black, art deco lines, warm tropical lounge. Match the logo, which is a gold art deco diamond crest on black.

## Brand and vibe
- Positioning line: "Where the game meets the good life."
- Tone: confident, warm, understated luxury. Not loud, not cheesy. Honest, not hypey.
- Copy rule, strict: no hyphens or dashes anywhere in visible copy. Use commas or restructure the sentence instead.
- Keep copy short and punchy. No filler.

## Design system
**Palette (dark premium)**
- Base background: `#0B0B0C` (near black)
- Raised surfaces / cards: `#141416`
- Champagne gold accent gradient: `#C9A24B` to `#F0D98C` (use for the crest, hairlines, key CTAs, active states)
- Ivory text: `#F5F1E8` for headings, `#C9C6BE` for body
- Warm amber glow `#8A6A2F` for subtle depth behind hero
- Success/open badge green: `#3E7C57` (used sparingly, only for the live "Open now" pill)

**Typography**
- Display / headings: an elegant high contrast serif or deco face (Cormorant Garamond or Playfair Display), tight tracking, large.
- Body / UI: a clean geometric sans (Inter or Satoshi).
- Small labels: uppercase sans, wide letter spacing, gold.

**Motif and details**
- Thin gold hairline dividers and thin gold framing rectangles echoing the logo's deco border.
- Subtle grain/noise texture over dark sections so it does not look flat.
- Soft warm vignette behind the hero.
- Micro interactions: gold underline sweep on links, gentle lift on cards, fade up on scroll. Keep motion subtle and fast, no bounce.
- Rounded corners small (6 to 10px), luxury not playful.
- Generous whitespace and vertical rhythm.

**Do NOT** use localStorage or sessionStorage anywhere. Keep all state in React state.

## Page structure (single page, anchored nav)

**1. Sticky top bar**
- Left: TE.BRA gold crest logo. Right: anchor links (Experience, Sport, Drinks, Reviews, Find Us) plus a gold primary button "Get Directions".
- On mobile: collapse links to a slim menu, keep "Directions" and a phone/WhatsApp icon always visible.
- Include a live "Open now / Closed" pill that computes from opening hours (11:00 to 00:00 daily) in the visitor's local time, defaulting to Europe/Athens for the venue. Show next open time when closed.

**2. Hero (full viewport)**
- Dark cinematic hero with warm vignette. Big serif headline: "The most stylish sports bar in Hersonissos." Subhead: "Cold drinks, big screens, deco lounge vibes, five minutes from the strip." 
- Trust row directly under the subhead, as small gold-framed pills: "5.0 on Tripadvisor", "Rated number 1 nightlife in Hersonissos", "Travelers' Choice 2026", "86 plus five star reviews".
- Two CTAs: primary gold "Get Directions", secondary outline "Book a table for the match".
- Small line: "Open daily 11:00 til late."

**3. Trust / social proof bar**
- Slim horizontal strip: aggregate rating 5.0, gold stars, "86 reviews", Tripadvisor logo, "#1 Nightlife in Hersonissos", Travelers' Choice badge. This should also be marked up in schema (see SEO section).

**4. Experience section ("Where relaxation meets sophistication")**
- Three to four feature cards with gold line icons:
  - "Deco lounge, done right" — Scandi chic decor, comfortable seating, spotless, air conditioned.
  - "Every game, every screen" — multiple large satellite screens, all the football and major sport.
  - "Cocktails with a talent behind them" — handcrafted cocktails, generous measures, premium spirits, cold beer and wine.
  - "Play a little" — pool table and darts.
- Warm photography grid. Leave labelled image slots the owner will replace: `hero.jpg`, `lounge-1.jpg`, `lounge-2.jpg`, `cocktails.jpg`, `screens.jpg`, `exterior-dusk.jpg`.

**5. Sport / match-day section (CRO focus)**
- Headline: "Reserve your seat for the big game."
- Copy: "Champions League nights, cup finals, Sunday football. Tell us the match, we will save you the best seat in the house."
- Primary CTA opens a WhatsApp message prefilled: "Hi TE.BRA, I would like to reserve a table for [match / date / time], for [number] people." Use `https://wa.me/[[WHATSAPP_NUMBER_INTL_NO_PLUS]]?text=...`.
- Secondary: "Call us" tel link to `[[PHONE]]`.
- If you have a fixtures list later this can become a live "What's on this week" board. For now a static elegant card is fine.

**6. Drinks / menu teaser**
- Short elegant menu preview, not a full price list: signature cocktails, premium spirits, cold beers, soft drinks, and a note that breakfast and snacks are served. Mention the house favourite cocktail as a highlight.
- CTA: "See the full menu" (link to `[[MENU_URL_OR_PDF]]`, or make it scroll to a simple menu block if no PDF yet).

**7. Reviews module (the important one)**
This must show real reviews, newest first, with badges. Build it so the data source is swappable.

- Layout: a headline "Loved by everyone who finds it", the 5.0 aggregate with gold stars and "86 reviews", plus a badge row: a gold "Travelers' Choice 2026" badge, a "#1 Nightlife in Hersonissos" badge, and a "Verified on Tripadvisor" badge.
- Below: a responsive grid or horizontal snap carousel of review cards. Each card: star row, review title, short body, reviewer first name, relative date ("2 days ago"), and a small badge on the newest 3 cards that says "New" in gold. Sort strictly by date descending so the freshest review is always first and gets the "New" tag automatically.
- Add a filter/sort control ("Most recent" default, "Highest rated") even though most are five star, because it reads as trustworthy and interactive.
- CTA under the grid: gold outline button "Read all reviews on Tripadvisor" linking to the Tripadvisor page.

**Data source, do this properly:**
- Create a `reviews.js` data file seeded with the real reviews below.
- Structure the reviews component to read from a single `getReviews()` function so it can later be pointed at:
  - Option A (recommended): a Google Places API "Place Details" call returning `rating`, `user_ratings_total`, and `reviews` (author_name, rating, text, time). Add a clear `// TODO: swap seed for Google Places API` comment with the fetch shape.
  - Option B: a Featurable or Elfsight embed if the owner prefers a no code widget.
- The badges ("New", "Travelers' Choice", "#1 Nightlife") are computed/config driven, not hardcoded into each card, so they survive a data source swap.

Seed data (`reviews.js`), real and current as of late June 2026, sorted newest first:

```js
export const REVIEW_SUMMARY = {
  rating: 5.0,
  total: 86,
  source: "Tripadvisor",
  tripadvisorUrl:
    "https://www.tripadvisor.com/Attraction_Review-g503710-d33284920-Reviews-TE_BRA_Sports_Bar-Hersonissos_Crete.html",
  badges: ["Travelers' Choice 2026", "#1 Nightlife in Hersonissos", "5.0 rating"],
};

// Short snippets only. For full review text, pull live via Google Places API
// or a Featurable/Elfsight widget so attribution is handled correctly.
export const REVIEWS = [
  { name: "Magdalena W", rating: 5, date: "2026-06-27",
    title: "Top bar",
    snippet: "You walk in a stranger and leave a friend. Zach always welcomes you with a smile." },
  { name: "Jeevan J", rating: 5, date: "2026-06-27",
    title: "Best place on the island",
    snippet: "Friendly atmosphere, every sport on the screens, pool and darts. Great for families and groups." },
  { name: "Jodie P", rating: 5, date: "2026-06-26",
    title: "Fantastic bar, exceptional service",
    snippet: "Zac and Valentina made us feel welcome from the moment we arrived. We came back every day." },
  { name: "Global13482215665", rating: 5, date: "2026-06-25",
    title: "Hidden gem, best bar in Hersonissos",
    snippet: "Beautifully decorated to a high standard, spotless, and the owner is one of the nicest guys you will meet." },
  { name: "Mitchell V", rating: 5, date: "2026-06-24",
    title: "A great experience",
    snippet: "Warm atmosphere, friendly bartender, and they serve breakfast too. Quality food and plenty of it." },
  { name: "Compass05437472743", rating: 5, date: "2026-05-20",
    title: "Best bar in Hersonissos",
    snippet: "Spotless, modern and stylish. Great music, huge TVs for the game, and fantastic cocktails." },
  { name: "Anne-Marie A", rating: 5, date: "2026-04-27",
    title: "Exceptional",
    snippet: "Class bar with no less than seven flat screens. The top spot for sports lovers." },
  { name: "John and Kate", rating: 5, date: "2026-04-22",
    title: "Amazing bar, go visit",
    snippet: "Beautifully furnished, very Scandi chic, high quality screens and incredible cocktails with generous measures." },
];
```

## SEO (expert level, this matters)

**Meta and head**
- Title: `TE.BRA Sports Bar Hersonissos | Cocktails, Big Screens, Live Sport`
- Meta description: `The number one rated sports bar in Hersonissos, Crete. Handcrafted cocktails, every big match on the screens, pool and darts, in a stylish deco lounge. Open daily.`
- Canonical, lang `en`, and a Greek `el` alternate placeholder for later.
- Open Graph and Twitter card with the crest logo and a hero image, `og:type=business.business`.
- Favicon and touch icons from the gold crest.

**Target keywords to weave naturally into headings and copy**
- primary: sports bar Hersonissos, bar Hersonissos, sports bar Chersonissos, sports bar Crete
- secondary: cocktail bar Hersonissos, watch football Hersonissos, watch Champions League Crete, best bar Hersonissos, cocktails Hersonissos
- Use these in H1, section H2s, image alt text, and the FAQ. Do not stuff.

**Structured data (JSON-LD), include all three**

1. `BarOrPub` (LocalBusiness) with:
```json
{
  "@context": "https://schema.org",
  "@type": "BarOrPub",
  "name": "TE.BRA Sports Bar",
  "image": "[[HERO_IMAGE_URL]]",
  "url": "[[SITE_URL]]",
  "telephone": "[[PHONE]]",
  "priceRange": "€€",
  "servesCuisine": ["Cocktails", "Bar food", "Breakfast"],
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "[[STREET_ADDRESS]]",
    "addressLocality": "Hersonissos",
    "addressRegion": "Crete",
    "postalCode": "[[POSTCODE]]",
    "addressCountry": "GR"
  },
  "geo": { "@type": "GeoCoordinates", "latitude": 35.31635468, "longitude": 25.387603686 },
  "openingHoursSpecification": [{
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
    "opens": "11:00", "closes": "00:00"
  }],
  "sameAs": [
    "https://www.instagram.com/tebra_sports_bar/",
    "https://www.facebook.com/p/TEBRA-Sports-Bar-61578308090517/",
    "https://www.tripadvisor.com/Attraction_Review-g503710-d33284920-Reviews-TE_BRA_Sports_Bar-Hersonissos_Crete.html"
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "5.0",
    "reviewCount": "86",
    "bestRating": "5"
  },
  "amenityFeature": [
    {"@type":"LocationFeatureSpecification","name":"Live sport on multiple large screens","value":true},
    {"@type":"LocationFeatureSpecification","name":"Pool table","value":true},
    {"@type":"LocationFeatureSpecification","name":"Darts","value":true},
    {"@type":"LocationFeatureSpecification","name":"Air conditioning","value":true},
    {"@type":"LocationFeatureSpecification","name":"Cocktails","value":true},
    {"@type":"LocationFeatureSpecification","name":"Breakfast served","value":true}
  ]
}
```
2. A couple of `Review` objects from the seed data (author, datePublished, reviewRating), so rich results can surface recent five star reviews.
3. `FAQPage` for the FAQ section below (great for Google and for AI answer engines like ChatGPT and Perplexity).

**Semantic and technical**
- Proper landmark structure: one `h1`, ordered `h2` per section, `header`, `main`, `section`, `footer`, `nav`.
- Descriptive alt text on every image using target keywords where natural.
- Lazy load below the fold images, preload the hero.
- Fast: compress images, no heavy libraries, aim for a strong Lighthouse score on mobile.
- Generate a `sitemap.xml` and `robots.txt` that allow indexing.
- All external links `rel="noopener"`, review/social links open in new tab.

## FAQ section (for SEO and AI answer engines)
Elegant accordion, gold hairlines. Use these real, answerable questions. Mark up as FAQPage schema.
- "Where is TE.BRA Sports Bar in Hersonissos?" Near the villas and a short drive from the main strip, in a quieter, nicer setting. Coordinates and directions link below.
- "What sport can I watch at TE.BRA?" Multiple large satellite screens showing football, Champions League, and major live sport. Ask us to put your match on.
- "Can I reserve a table for a big match?" Yes. Message us on WhatsApp with the match and your party size and we will save you a seat.
- "Does TE.BRA serve food?" Yes, breakfast, snacks and bar food, alongside cocktails, beer, wine and premium spirits.
- "What are the opening hours?" Open daily from 11:00 until late.
- "Is it good for families and groups?" Yes, families and groups are welcome, with pool, darts and comfortable seating.

## Find us section (footer area)
- Embedded Google Map centered on 35.31635, 25.38760.
- NAP block: name, address `[[STREET_ADDRESS]], Hersonissos, Crete [[POSTCODE]], Greece`, phone `[[PHONE]]`, hours.
- Buttons: "Get directions" (Google Maps directions URL to the coords), "Message on WhatsApp", "Call".
- Social row: Instagram @tebra_sports_bar, Facebook, Tripadvisor. Gold line icons.
- Small credit line and copyright.

## Conversion details to include everywhere
- A slim sticky bottom action bar on mobile: "Directions" and "WhatsApp", always reachable.
- Every CTA is gold and unambiguous. Directions and WhatsApp are the two primary conversions, table reservation for a match is the hero secondary.
- Keep the "New" review badge and the live "Open now" pill, they both build trust and freshness.

## Placeholders to confirm before launch
- `[[PHONE]]` and `[[WHATSAPP_NUMBER_INTL_NO_PLUS]]` (do not guess these)
- `[[STREET_ADDRESS]]` and `[[POSTCODE]]` for Hersonissos
- `[[SITE_URL]]`, `[[HERO_IMAGE_URL]]`, `[[MENU_URL_OR_PDF]]`
- Confirm hours are truly daily 11:00 to 00:00

---

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://tebra-sports-bar.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/de525b7f-6912-4fcf-8e81-e76ba2a71178).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
