<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Sports fixtures
- Keep homepage fixture records in a dedicated, source-cited data module and selection/time formatting in `src/lib/sports-fixtures.ts` so verification evidence and Greek timezone handling stay independently testable.
- Never infer live scores or confirmed Tebra screenings from scheduled start times; hide past starts and offer WhatsApp requests for screening confirmation.
