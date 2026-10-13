# Random Stuff

A handpicked directory of useful websites, desktop software, and scripts for builders and creators. Explore tools for development, design, productivity, media, privacy, and everyday workflows.

[Explore the directory](https://randomstuff.shocka.site/) · [Submit a tool](https://randomstuff.shocka.site/submit)

## What the site showcases

- 300+ tools with descriptions, links, platform tags, and source repositories where available.
- Categories for websites, software, and scripts, with platform, CLI, and open-source filters.
- Topic-aware search with aliases and typo matching, plus a command palette (`⌘K` / `Ctrl+K`).
- Curated tool stacks, random discovery through Surprise Roulette, and side-by-side comparisons.
- Favorites saved in your browser, with bulk selection and Markdown, JSON, and HTML exports, plus JSON import.
- Shareable links to tools, searches, and filters, an RSS feed, and offline caching.
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

Add a record to `src/data/items.ts`, then run the checks above and open a pull request. You can also suggest a tool through the [submission form](https://randomstuff.shocka.site/submit).

Built by [Nipun Yatawara / ShockaGG](https://shocka.site/).
