import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import sportsDesk from "../content/sports-desk.html?raw";
import programmeLoader from "../content/programme-loader.js?raw";
import programme from "../../public/sports-programme.json";

const sportSelection = `(function(){const params=new URLSearchParams(location.search);const chosen=params.get('sport');const allowed=['Football','F1','Golf','Rugby','Tennis','Basketball','Fight'];if(allowed.includes(chosen)){const button=Array.from(document.querySelectorAll('.sport-filters button')).find(b=>(b.getAttribute('onclick')||'').includes("'" + chosen + "'"));if(button&&typeof filterSport==='function')filterSport(chosen,button);}const competition=params.get('competition');const select=document.getElementById('competition');if(competition&&select&&Array.from(select.options).some(option=>option.value===competition)){select.value=competition;if(typeof render==='function')render();}})();`;
const title = "TEBRA Sports Desk | Hersonissos, Crete";
const description = "Explore the Tebra sports programme, sports news and practical visitor guide. Times in Greece. Contact Tebra to confirm your match and table.";
const image = "https://tebrabar.com/__l5e/assets-v1/34e67f05-c289-4244-a782-8d562f0baaa7/os_bar_17.jpg";
const socialMeta = `<meta property="og:title" content="${title}"><meta property="og:description" content="${description}"><meta property="og:type" content="website"><meta name="twitter:card" content="summary_large_image"><meta property="og:image" content="${image}"><meta name="twitter:image" content="${image}">`;

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function featuredHero(): string {
  const now = Date.now();
  const upcoming = programme.events
    .filter((event) => Date.parse(event.start) >= now)
    .sort((a, b) => Date.parse(a.start) - Date.parse(b.start));
  if (!upcoming.length) return "";
  const nextDate = upcoming[0].date;
  const sameDay = upcoming.filter((event) => event.date === nextDate);
  const featured = sameDay.find((event) => event.title === "Olympiacos vs Sparta Praha")
    ?? sameDay.find((event) => event.title === "Juventus vs Rennes")
    ?? sameDay.find((event) => event.title === "Jablonec vs Brighton")
    ?? sameDay.find((event) => event.featured)
    ?? sameDay[0];
  const label = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Athens", weekday: "long", day: "numeric", month: "long", year: "numeric",
  }).format(new Date(featured.start)).toUpperCase();
  const safeTitle = escapeHtml(featured.title);
  const safeCompetition = escapeHtml(featured.competition.toUpperCase());
  const safeBooking = `${featured.title} • ${label} • ${featured.time} Greece`.replace(/[\\']/g, "\\$&");
  return `<section class="hero compact-hero"><div class="feature"><div class="eyebrow"><span class="event-dot"></span> NEXT FEATURED FIXTURE · ${safeCompetition}</div><p class="event-date">${label}</p><h2>${safeTitle}</h2><div class="time">${featured.time} <span style="font-size:12px;font-weight:normal;color:#aaa">• Greek local time</span></div><p style="font-size:11px">Fixture verified · Tebra screening awaiting confirmation</p><button class="gold" style="margin-top:24px" onclick="book('${safeBooking}')">REQUEST A TABLE ↗</button></div></section>`;
}

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
      GET: () => {
        const html = sportsDesk
          .replace(/<section class="hero compact-hero">[\s\S]*?<\/section>/, featuredHero() || '<section class="hero compact-hero"><div class="feature"><div class="eyebrow">TEBRA SPORTS DESK</div><h2>Find your next match</h2></div></section>')
          .replace(/Programme checked 6 October 2026/g, `Programme checked ${programme.checked}`)
          .replace("</html>", `<script>${programmeLoader}</script><script>${sportSelection}</script></html>`)
          .replace("</title>", `</title>${socialMeta}`);
        return new Response(html, {
          headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "public, max-age=300" },
        });
      },
    },
  },
});
