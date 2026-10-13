# Random Stuff

A handpicked directory of useful websites, desktop software, and scripts for builders and creators. Explore tools for development, design, productivity, media, privacy, and everyday workflows.

[Explore the directory](https://randomstuff.shocka.site/) · [Submit a tool](https://randomstuff.shocka.site/submit)

## What the site showcases

- 300+ tools with descriptions, links, platform tags, and source repositories where available.
- Categories for websites, software, and scripts, with platform, CLI, and open-source filters.
- Topic-aware search with aliases and typo matching, plus a command palette (`⌘K` / `Ctrl+K`).
- Curated tool stacks, random discovery through Surprise Roulette, and comparisons of pricing, licensing, account requirements, and offline support. Comparison facts cite official sources; unreviewed fields are marked "Not verified".
- Favorites saved in your browser, with bulk selection and Markdown, JSON, and HTML exports, plus JSON import.
- Shareable links to tools, searches, filters, and stacks, a date-sorted RSS feed, and offline caching.
- Light and dark modes that follow your system preference until you choose a mode, with your choice saved locally.
- Keyboard-accessible previews and dialogs with focus containment and Escape to close.
- An otter loader that counts completed startup resources: the restored catalog, page load, fonts, and visible images (including decoding). It finishes when these resources settle, without a simulated progress timer or replay button. Offscreen lazy images load as you browse.
- A submission form that sends suggestions to a Discord channel for maintainer review.

## How it is built

Next.js, React, and TypeScript, styled with Tailwind CSS. Framer Motion, GSAP, and Lenis power the animations and interactions.

The entire catalog lives in [`src/data/items.ts`](src/data/items.ts); curated stacks live in [`src/data/stacks.ts`](src/data/stacks.ts). No external database is required. The homepage, catalog API, and RSS feed are generated at build time, and search and filtering run locally in the browser. Favorites stay in local storage.

## Run locally

Use Node.js 20.9+ and npm.

```bash
npm ci
npm run dev
```

Open [localhost:3000](http://localhost:3000).

```bash
npm run lint
npx tsc --noEmit
npm test
npm run build
npm start
```

To enable submission delivery, set `DISCORD_WEBHOOK_URL` in `.env.local` (or your hosting environment). The catalog works without it. `NEXT_PUBLIC_SITE_URL` optionally overrides the RSS feed's site URL.

## Add a tool

Add a record to `src/data/items.ts` with an `addedAt` ISO timestamp, then run the checks above and open a pull request. Existing addition dates were recovered from Git history and stored in `src/data/catalog-dates.ts`. "New" badges expire after 30 days; the client refreshes them during long visits. Dates are displayed in Asia/Colombo time.

Sourced comparison facts live in `src/data/comparison-details.ts`. Include the review date and official source URLs when adding facts; leave unknown fields unset.

Run `npm run check:catalog` locally to check duplicate records, valid URLs, required fields, dates, comparison sources, and stack references. Run `npm run check:links` locally to check external URLs and write a report without modifying the catalog. These checks are manual; the repository has no GitHub Actions workflows. The [current review list](docs/catalog-link-review.md) records links that need attention. You can also suggest a tool through the [submission form](https://randomstuff.shocka.site/submit).

Built by [Nipun Yatawara / ShockaGG](https://shocka.site/).
