import { createServerFn } from "@tanstack/react-start";
import { REVIEW_PLATFORMS, reviewFeedSchema, type PlatformFeed } from "./review-feed";

// Feed URLs belong to an authenticated review-provider export configured by the
// site owner. Never accept a fetch URL from a browser request or expose its token.
// Each export must contain this venue's rating, count and newest reviews.
export const getLiveReviews = createServerFn({ method: "GET" }).handler(async (): Promise<PlatformFeed[]> => {
  return Promise.all(REVIEW_PLATFORMS.map(async platform => {
    const url = process.env[platform.id === "google" ? "GOOGLE_REVIEWS_FEED_URL" : "TRIPADVISOR_REVIEWS_FEED_URL"];
    if (!url) return { ...platform, data: null, fetchedAt: null };
    try {
      if (new URL(url).protocol !== "https:") throw new Error("HTTPS required");
      const response = await fetch(url, { signal: AbortSignal.timeout(10000), cache: "no-store" });
      if (!response.ok) throw new Error("Provider unavailable");
      const data = reviewFeedSchema.parse(await response.json());
      data.reviews.sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
      return { ...platform, data, fetchedAt: new Date().toISOString() };
    } catch {
      // Do not replace unavailable live data with fabricated seed reviews/counts.
      // Do not log URLs: provider credentials may be embedded in them.
      console.error(`[reviews] ${platform.id} feed unavailable or invalid`);
      return { ...platform, data: null, fetchedAt: null };
    }
  }));
});
