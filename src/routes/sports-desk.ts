import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import sportsDesk from "../content/sports-desk.html?raw";
import programmeLoader from "../content/programme-loader.js?raw";

export const Route = createFileRoute("/sports-desk")({
  server: { handlers: { GET: () => new Response(sportsDesk.replace("</script></html>", `${programmeLoader}\n</script></html>`), {
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "public, max-age=300" },
  }) } },
});
