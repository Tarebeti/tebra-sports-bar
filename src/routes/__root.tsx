import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-display text-gold-gradient">404</h1>
        <h2 className="mt-4 text-xl text-ivory">Page not found</h2>
        <p className="mt-2 text-sm text-ivory-dim">
          The page you are looking for does not exist.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-gold-gradient px-5 py-2.5 text-sm font-medium text-background transition-transform hover:-translate-y-0.5"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl text-ivory">This page did not load</h1>
        <p className="mt-2 text-sm text-ivory-dim">
          Something went wrong. Try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-gold-gradient px-5 py-2.5 text-sm font-medium text-background"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-border px-5 py-2.5 text-sm font-medium text-ivory hover:bg-surface-raised"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

const ORG_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "BarOrPub",
  name: "TE.BRA Sports Bar",
  url: "/",
  image: "https://oceanspace.gr/wp-content/uploads/2025/10/OS_BAR_25.jpg",
  telephone: "+30 699 339 9000",
  priceRange: "€€",
  servesCuisine: ["Cocktails", "Bar food", "Breakfast"],
  address: {
    "@type": "PostalAddress",
    streetAddress: "Hersonissos",
    addressLocality: "Hersonissos",
    addressRegion: "Crete",
    postalCode: "70014",
    addressCountry: "GR",
  },
  geo: { "@type": "GeoCoordinates", latitude: 35.31635468, longitude: 25.387603686 },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "11:00",
      closes: "00:00",
    },
  ],
  sameAs: [
    "https://www.instagram.com/tebra_sports_bar/",
    "https://www.facebook.com/p/TEBRA-Sports-Bar-61578308090517/",
    "https://www.tripadvisor.com/Attraction_Review-g503710-d33284920-Reviews-TE_BRA_Sports_Bar-Hersonissos_Crete.html",
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "5.0",
    reviewCount: "86",
    bestRating: "5",
  },
  amenityFeature: [
    { "@type": "LocationFeatureSpecification", name: "Live sport on multiple large screens", value: true },
    { "@type": "LocationFeatureSpecification", name: "Pool table", value: true },
    { "@type": "LocationFeatureSpecification", name: "Darts", value: true },
    { "@type": "LocationFeatureSpecification", name: "Air conditioning", value: true },
    { "@type": "LocationFeatureSpecification", name: "Cocktails", value: true },
    { "@type": "LocationFeatureSpecification", name: "Breakfast served", value: true },
  ],
};

const FAQ_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Where is TE.BRA Sports Bar in Hersonissos?",
      acceptedAnswer: { "@type": "Answer", text: "Near the villas, a short drive from the main strip in Hersonissos, Crete, in a quieter and nicer setting." },
    },
    {
      "@type": "Question",
      name: "What sport can I watch at TE.BRA?",
      acceptedAnswer: { "@type": "Answer", text: "Multiple large satellite screens showing football, Champions League and major live sport. Ask us to put your match on." },
    },
    {
      "@type": "Question",
      name: "Can I reserve a table for a big match?",
      acceptedAnswer: { "@type": "Answer", text: "Yes. Message us on WhatsApp with the match and your party size and we will save you a seat." },
    },
    {
      "@type": "Question",
      name: "Does TE.BRA serve food?",
      acceptedAnswer: { "@type": "Answer", text: "Yes, breakfast, snacks and bar food, alongside cocktails, beer, wine and premium spirits." },
    },
    {
      "@type": "Question",
      name: "What are the opening hours?",
      acceptedAnswer: { "@type": "Answer", text: "Open daily from 11:00 until late." },
    },
    {
      "@type": "Question",
      name: "Is it good for families and groups?",
      acceptedAnswer: { "@type": "Answer", text: "Yes, families and groups are welcome, with pool, darts and comfortable seating." },
    },
  ],
};

const TITLE = "TE.BRA | Cocktail & Sports Bar in Hersonissos, Crete";
const DESCRIPTION =
  "Best cocktails in Hersonissos plus every big match on our screens. Sports lounge with pool, darts, great food. Open daily. 5.0 on Tripadvisor.";
const OG_IMAGE =
  "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/9e67ad64-0449-4a2d-94e4-44bd910707a2/id-preview-97f88f63--de525b7f-6912-4fcf-8e81-e76ba2a71178.lovable.app-1782899533974.png";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { name: "author", content: "TE.BRA Sports Bar" },
      { name: "keywords", content: "sports bar Hersonissos, sports bar Crete, cocktail bar Hersonissos, Hersonissos nightlife, Crete sports bar, live football Hersonissos, Champions League Hersonissos, TE.BRA, TEBRA bar" },
      { name: "geo.region", content: "GR-M" },
      { name: "geo.placename", content: "Hersonissos, Crete" },
      { name: "geo.position", content: "35.31635468;25.387603686" },
      { name: "ICBM", content: "35.31635468, 25.387603686" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "TE.BRA Sports Bar" },
      { property: "og:url", content: "https://tebrabar.com/" },
      { property: "og:locale", content: "en_GB" },
      { property: "og:locale:alternate", content: "el_GR" },
      { property: "og:image", content: OG_IMAGE },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: OG_IMAGE },
      { name: "theme-color", content: "#0B0B0C" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "apple-touch-icon", href: "/favicon.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap",
      },
    ],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(ORG_JSON_LD) },
      { type: "application/ld+json", children: JSON.stringify(FAQ_JSON_LD) },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
