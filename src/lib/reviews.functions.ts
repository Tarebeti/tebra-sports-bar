import { createServerFn } from "@tanstack/react-start";
import { REVIEW_SUMMARY, getReviews as getSeedReviews, type Review, type ReviewSummary } from "./reviews";

const TRIPADVISOR_URL = REVIEW_SUMMARY.tripadvisorUrl;

interface LiveReviewsPayload {
  summary: ReviewSummary;
  reviews: Review[];
  fetchedAt: string;
  source: "live" | "seed";
}

function seedPayload(source: "live" | "seed" = "seed"): LiveReviewsPayload {
  return {
    summary: REVIEW_SUMMARY,
    reviews: getSeedReviews(),
    fetchedAt: new Date().toISOString(),
    source,
  };
}

/**
 * Fetch the latest Tripadvisor reviews for TE.BRA via Firecrawl.
 * Returns the seed dataset when the Firecrawl connector isn't enabled or
 * the scrape fails, so the UI never breaks.
 */
export const getLiveReviews = createServerFn({ method: "GET" }).handler(async (): Promise<LiveReviewsPayload> => {
  const apiKey = process.env.FIRECRAWL_API_KEY;
  if (!apiKey) return seedPayload("seed");

  try {
    const { default: Firecrawl } = await import("@mendable/firecrawl-js");
    const fc = new Firecrawl({ apiKey });

    const result = await fc.scrape(TRIPADVISOR_URL, {
      formats: [
        {
          type: "json",
          prompt:
            "Extract Tripadvisor reviews for TE.BRA Sports Bar. Return: rating (overall 0-5, number), total (total number of reviews, integer), reviews (array of latest reviews, up to 12, with fields: name (reviewer name), rating (1-5), date (ISO YYYY-MM-DD), title (review title), snippet (short 1-2 sentence excerpt of the review body, plain text, no HTML)).",
        },
      ],
      onlyMainContent: true,
    });

    const json = (result as { json?: unknown }).json as
      | { rating?: number; total?: number; reviews?: Array<Partial<Review>> }
      | undefined;

    if (!json || !Array.isArray(json.reviews) || json.reviews.length === 0) {
      return seedPayload("seed");
    }

    const cleanReviews: Review[] = json.reviews
      .filter((r): r is Review =>
        !!r &&
        typeof r.name === "string" &&
        typeof r.rating === "number" &&
        typeof r.date === "string" &&
        typeof r.title === "string" &&
        typeof r.snippet === "string",
      )
      .map((r) => ({
        name: r.name.slice(0, 60),
        rating: Math.max(1, Math.min(5, Math.round(r.rating))),
        date: r.date.slice(0, 10),
        title: r.title.slice(0, 140),
        snippet: r.snippet.slice(0, 320),
      }))
      .sort((a, b) => (a.date < b.date ? 1 : -1));

    if (cleanReviews.length === 0) return seedPayload("seed");

    return {
      summary: {
        ...REVIEW_SUMMARY,
        rating: typeof json.rating === "number" ? Math.round(json.rating * 10) / 10 : REVIEW_SUMMARY.rating,
        total: typeof json.total === "number" ? json.total : REVIEW_SUMMARY.total,
      },
      reviews: cleanReviews,
      fetchedAt: new Date().toISOString(),
      source: "live",
    };
  } catch (err) {
    console.error("[getLiveReviews] Firecrawl scrape failed:", err);
    return seedPayload("seed");
  }
});

export type { LiveReviewsPayload };
