# Review sync activation (not active yet)

The homepage now has an adapter for two server-only review provider exports:
`GOOGLE_REVIEWS_FEED_URL` and `TRIPADVISOR_REVIEWS_FEED_URL`.
No export provider or credentials have been connected or verified. These are
integration points, not native Google/Tripadvisor endpoints. Do not announce
live sync until both exports return real data and production is verified.

Exports must provide this shape (dates are ISO timestamps):

```json
{"rating":4.8,"total":123,"reviews":[{"name":"Guest","rating":5,"date":"2026-11-05T08:00:00Z","title":"Review title","snippet":"Exact attributed excerpt"}]}
```

The configured provider must supply Tebra's actual latest reviews, permitted
for republication, with ratings/counts. Missing/failed exports display only
profile links, never the obsolete 183-review seed dataset. Each provider fails
independently. Review counts are displayed even when no text reviews exist.
The browser refreshes on focus and every 60 seconds while open; provider delay
is additional. This is polling, not immediate publication or a background job.
A provider supporting notifications/webhooks and durable storage is still
needed for guaranteed unattended ingestion and deduplication.

Activation requires access to the Lovable hosting configuration and an
approved data source for both platforms. Do not put credentials in client code.
Google Places only returns a small selection and cannot guarantee every new
review; Business Profile reviews requires owner OAuth. Tripadvisor fetching
also needs an authenticated provider/API integration and validation.

Validation completed: production build, schema tests and whitespace check.
Live export ingestion and production publication have NOT been verified.
