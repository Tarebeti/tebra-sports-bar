import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import sportsDesk from "../content/sports-desk.html?raw";
import programmeLoader from "../content/programme-loader.js?raw";
const title = "TEBRA Sports Desk | Hersonissos, Crete";
const description = "Explore the Tebra sports programme, sports news and practical visitor guide. Times in Greece. Contact Tebra to confirm your match and table.";
const image = "https://tebrabar.com/__l5e/assets-v1/34e67f05-c289-4244-a782-8d562f0baaa7/os_bar_17.jpg";
const socialMeta = `<meta property="og:title" content="${title}"><meta property="og:description" content="${description}"><meta property="og:type" content="website"><meta name="twitter:card" content="summary_large_image"><meta property="og:image" content="${image}"><meta name="twitter:image" content="${image}">`;

export const Route = createFileRoute("/sports-desk")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:image", content: image },
      { name: "twitter:image", content: image },
    ],
  }),
  server: {
    handlers: {
      GET: () => new Response(sportsDesk.replace("</html>", `<script>${programmeLoader}</script></html>`).replace("</title>", `</title>${socialMeta}`), {
        headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "public, max-age=300" },
      }),
    },
  },
});
