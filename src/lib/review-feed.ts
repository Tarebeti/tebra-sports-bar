import { z } from "zod";

export const REVIEW_PLATFORMS = [
  { id: "tripadvisor", name: "Tripadvisor", href: "https://www.tripadvisor.com/Attraction_Review-g503710-d33284920-Reviews-TE_BRA_Sports_Bar-Hersonissos_Crete.html" },
  { id: "google", name: "Google", href: "https://maps.app.goo.gl/BKm2gsfkUKHxqGo67" },
] as const;

const reviewSchema = z.object({
  name: z.string().trim().min(1).max(120),
  rating: z.number().int().min(1).max(5),
  date: z.string().datetime({ offset: true }),
  title: z.string().max(200),
  snippet: z.string().trim().min(1).max(2000),
});
export const reviewFeedSchema = z.object({
  rating: z.number().min(1).max(5),
  total: z.number().int().nonnegative(),
  reviews: z.array(reviewSchema).max(50),
});
export type ReviewFeed = z.infer<typeof reviewFeedSchema>;
export type PlatformFeed = typeof REVIEW_PLATFORMS[number] & {
  data: ReviewFeed | null;
  fetchedAt: string | null;
};
