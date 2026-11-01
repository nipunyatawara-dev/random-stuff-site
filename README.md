# Random Stuff

An independent directory of handpicked websites, desktop apps and scripts, maintained by Nipun / ShockaGG.

[Explore the directory](https://randomstuff.shocka.site/) · [Suggest a tool](https://randomstuff.shocka.site/submit)

Search by name, task or tag. Browse categories, combine a platform with verified attributes, compare sourced facts, discover a random tool, and save favorites in this browser. JSON backups can be imported into an empty collection; Plain-text (.txt), Markdown and HTML exports include every saved tool, even when the list is filtered. Favorites do not sync between devices.

Tools and curated workflows have static `/tools/[id]` and `/stacks/[id]` pages with individual metadata, source reviews and correction links. A complete alphabetical text index works without JavaScript. Unknown pricing, license and platform facts are kept explicit. The site uses one self-hosted font, local monogram icons, native scrolling and keyboard-accessible dialogs. Light/dark themes follow system preference until changed. Reduced motion is honored; the directory is never blocked by an intro animation.

Use Node.js 24:

```sh
npm ci
npm run dev
```

Quality checks:

```sh
npm run lint
npm test
npm run build
npx tsc --noEmit
npm audit --omit=dev
npm run test:e2e
```

Catalog records live in `src/data/items.ts`; keep stable IDs, dates and topic memberships when editing a title. Add IDs to `src/data/catalog-ids.ts`. Workflows live in `src/data/stacks.ts`, and only officially sourced comparison facts belong in `src/data/comparison-details.ts`. Run `npm run check:catalog` after changes and `npm run check:links` for a reviewed URL report. Asset preparation is automatic before development/build.

The public metadata-fetch endpoint was removed. Submission delivery requires only the existing `DISCORD_WEBHOOK_URL`. Bounded local spam/duplicate checks work without another service; an optional Redis store can share those counters across server instances. See `.env.example`. There is a visible issue-link alternative when delivery is unavailable. See [deployment and maintenance](docs/deployment.md) for configuration, security-policy limits, offline caching and validation. CI performs build/tests/accessibility checks; link reviews run weekly.

The [original audit](docs/website-audit-2026-11-01.md) and [implementation notes](docs/audit-implementation.md) record the changes and operational follow-ups.
