# Random Stuff website audit — November 1, 2026

Implementation has since been applied locally. See [implementation notes](audit-implementation.md) for changes, validation and deployment prerequisites. The original findings below are retained as the audit record.

The strongest next step is to make finding and evaluating a tool faster, while closing the metadata endpoint's security gap. Keep the otter, the blue/navy/lime identity, local favorites, and lightweight catalog architecture. Spend less of the first screen on decoration and more on useful discovery.

This is a review and improvement backlog. Application code was not changed.

**Coverage and evidence.** Reviewed the live site at `https://randomstuff.shocka.site/` and the local source. Browser coverage included desktop at 1440×900, mobile at 390×844, and additional layout measurements at 768px and 320px widths. Inspected light and dark themes; the homepage/catalog, search, category/platform filters, empty and populated favorites, export/import menu, stack overview and selected stack, mobile navigation, comparison dialog, roulette, command palette, shared tool details, and submission page. Read the API handlers, service worker, manifest, RSS, sitemap, metadata, configuration, and tests. Static endpoints returned successfully. Later screenshot attempts for some views timed out; those views were inspected through the live DOM and source instead. Mobile viewport checks do not replace testing real iOS Safari or Android Chrome.

**Checks completed.** All 62 tests passed across eight files. ESLint, TypeScript (`tsc --noEmit`), and the production build passed. The lockfile and installed Next.js version are both 16.3.0. `npm audit` reported 29 affected package entries, including one critical entry; `npm audit --omit=dev` reported six entries: one critical, four high, and one moderate. These are dependency advisories, not six demonstrated attacks against this deployment. Two application issues were reproduced locally against the actual transpiled route helpers: the SSRF bypass and expired duplicate records. No real submission was sent to Discord and no internal address on the production host was probed. The existing external-link review was read, not rerun across the entire catalog.

Priority: **P0** = address immediately; **P1** = next release; **P2** = subsequent improvement. Each recommendation distinguishes observed behavior, source-level evidence, or an editorial judgment.

**1. P0 — Remove or repair the metadata endpoint's SSRF bypass.**

Confirmed locally in [the metadata handler](../src/app/api/metadata/route.ts). A normal IPv4 loopback URL was rejected, while its IPv6-mapped equivalent reached an HTTP fixture listening on the same loopback interface. `URL.hostname` retains IPv6 brackets, so `isIP(hostname)` returns zero; literal IP requests can also bypass the custom DNS lookup. Mapped IPv6 addresses need canonical parsing rather than slicing strings. The response can expose selected metadata from reachable internal HTML pages, and arbitrary requests themselves are a concern even when response content is limited. Actual reachable production resources were not tested.

No application caller of `/api/metadata` was found. If previews are no longer used, remove the route and its parsing dependency if otherwise unused. If retained, use an allowlist when feasible, restrict ports, validate literal and resolved addresses against a maintained public-address classifier, retain DNS pinning and redirect revalidation, and apply egress restrictions. Add local-fixture tests for IPv4, IPv6, mapped forms, redirects, and DNS changes. [OWASP SSRF guidance](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html) supports validating both address families and all resolved addresses.

**2. P0 — Update the framework and vulnerable dependency tree.**

The installed/locked Next.js 16.3.0 is flagged critical. Registry metadata returned 16.4.3 as the current release during this audit; upgrade Next.js and its ESLint configuration together to a supported patched release, refresh transitive packages, then rerun the checks and production dependency audit. Verify the resulting Sharp version as well. The [Next.js SVG image-optimization advisory](https://github.com/vercel/next.js/security/advisories/GHSA-2464-fhr4-w9xw) identifies a patch in 16.4.1 and Sharp 0.35.5 for its stated glibc/Linux conditions. Exposure depends on the deployed optimizer and hosting implementation.

Do not equate every advisory with an exploitable path here: the [ImageResponse advisory](https://github.com/vercel/next.js/security/advisories/GHSA-vcvr-r3jv-pc5j) requires attacker-controlled values in image generation; the current OG image uses repository-controlled content. Avoid blindly applying `npm audit fix --force`: the audit also suggested obsolete major-version downgrades for development tools.

**3. P1 — Use durable abuse controls for public APIs.**

Both handlers keep rate limits in process-local Maps, so limits reset on restarts and are independent across serverless instances. Submission duplicate prevention has the same limitation. A second bug was reproduced locally: expired duplicate entries remain when there are at most 1000 keys, because pruning only runs above that threshold and rejection uses `has()` without checking expiration. Check the stored expiry during lookup so the advertised 24-hour window actually expires. Use an atomic shared store or hosting-level rate limiting, a bounded key policy, and an explicitly trusted client-IP source. Review the precedence of caller-supplied IP headers against the actual host's guarantees; production header spoofing was not tested. Keep the honeypot and validation, and add a challenge only if real abuse warrants it. Return consistent retry guidance on both endpoints. Evidence: [submission handler](../src/app/api/submit/route.ts), [metadata handler](../src/app/api/metadata/route.ts).

**4. P1 — Bound upstream work and submission delivery time.**

The metadata fetcher uses a socket timeout rather than one deadline across DNS, connection, redirects, and response parsing. Redirect responses are not drained/destroyed before following the next URL, and response stream errors/aborts need explicit handling. Add a total deadline, abort on client disconnect, clean up redirect bodies, cap concurrency and URL length, and return useful 400/504 statuses. Submission delivery has no explicit webhook timeout; add one, bound the JSON request size before parsing, and use idempotency or a small durable outbox if guaranteed delivery matters. Do not display success before durable acceptance/delivery.

**5. P1 — Introduce a tested Content Security Policy.**

The live pages and [Next.js configuration](../next.config.ts) have framing and MIME-sniffing protection but no CSP. Start with report-only mode, inventory image/analytics origins, and add restrictive object/base/frame directives and an appropriate script policy. Account for the inline theme bootstrap and Next's generated scripts. Preserve the static-rendering benefits deliberately: request nonces have a rendering/cache cost, so follow [the current Next.js CSP guide](https://nextjs.org/docs/app/guides/content-security-policy) before selecting a nonce or build-compatible hash strategy. Narrow remote image host/path patterns to what is used. Verify deployed headers after release, not only configuration files.

**6. P1 — Put search in the first screen on desktop and mobile.**

Observed: at desktop width, search starts roughly 1054 CSS pixels down the document; at 390px mobile width, roughly 966px down. The visitor must pass a long headline, three competing actions, and the polaroid stage before reaching the site's main task. Use a short proposition such as “Useful tools, handpicked.” with one supporting sentence and a large search field. Put category shortcuts and a few useful tools directly below. Keep a compact otter/featured-tool moment, and move submission and roulette to secondary positions. Evidence: [hero](../src/components/HeroSection.tsx), [catalog controls](../src/components/ContentSection.tsx).

**7. P1 — Make the primary action visually primary.**

Editorial finding: the brightest lime action is currently roulette, while “Explore” has a quieter treatment. That hierarchy encourages random browsing before purposeful discovery. Give search/exploration the primary emphasis, keep roulette as an optional discovery shortcut, and avoid giving all three hero actions equal size. On mobile, the three vertically stacked buttons consume substantial space before any tools appear.

**8. P1 — Improve contrast and text legibility.**

The light-theme headline uses `#A0AFBB` on white for meaningful words, approximately 2.25:1 contrast. That falls below even the usual large-text AA threshold. Strengthen that token or use the main text color throughout the heading. Card descriptions are 12px on mobile and 14px at larger widths; domains and tags frequently use 9–11px text. Increase useful descriptions toward 15–16px and secondary metadata toward 12–13px, then retest both themes and focus/hover states. Evidence: [theme tokens](../src/app/globals.css), [cards](../src/components/DirectoryCard.tsx).

**9. P2 — Simplify the visual system while retaining its personality.**

Editorial finding: layered shadows, borders, pill badges, gradients, condensed display type, handwritten text, and monospace labels compete across the same screen. Retain the otter and a small amount of scrapbook styling, use one body family plus at most one accent/display family, flatten most catalog surfaces, and reserve elevation for dialogs and menus. Keep the directory card grid: it suits repeated tool records. A directory does not need ornamental photography or extra motion simply to meet a marketing-page style rubric. The design skill's source linter flagged these patterns; its house-style flags are not accessibility or security failures.

**10. P1 — Give mobile filters a visible, compact layout.**

Observed at 390px: the category row contains about 697px of content in 333px, and the platform row about 648px in 333px; both hide scrollbars. Favorites and stacks can be out of view. Use a few visible categories plus a “More”/filter control, wrap short choices, or use a bottom sheet with a visible active-filter count. Separate OS choice from attributes such as CLI and open source so users can combine them. Keep the current selected-filter summary and reset action visible.

**11. P2 — Make the hero's featured cards functional.**

The Raycast, Builder Stacks, and motto polaroids all invoke the same scroll-to-catalog action. Open the featured tool's details from Raycast and select the stacks view from Builder Stacks; make the motto noninteractive or link it to a real curation explanation. Replace “100% Free Tier” with precise plan wording, and derive counts such as the stack total from data instead of hardcoding them. On mobile, reduce the horizontally scrolling stage to one meaningful feature or move it below search.

**12. P1 — Correct the favorites import dead end.**

Confirmed in the browser and source: the export/import menu and its hidden file input only render when the favorites list already contains an item. A new browser cannot restore a backup without first saving something unrelated. Always expose Import in Favorites, especially in the empty state. Display “Saved on this browser” with a backup action so users understand the storage model. Evidence: [favorites controls](../src/components/ContentSection.tsx).

**13. P1 — Validate imported favorites against the current catalog.**

[Import parsing](../src/lib/export-favorites.ts) accepts arbitrary string IDs and the hook persists them without checking catalog membership. Unknown IDs can increase the Favorites badge while producing no cards; duplicate IDs can inflate the success message. Bound file size and ID count, deduplicate, match IDs against existing records, and report imported/already-present/unknown totals. Show a useful message for a valid file containing zero recognized tools. Reject malformed structures cleanly.

**14. P1 — Make filter and empty-state behavior understandable.**

Search and platform filters remain active when switching categories. Favorites can say “You haven't added any tools” when saved tools merely fail the current filters. In the stacks view the platform row disappears but its active filter still affects the tools. Show active filter chips, a result count, a “Clear all filters” action, and distinguish an empty collection from zero matching results. Decide explicitly whether switching to a stack clears unrelated filters. Validate unknown URL tag values instead of silently producing no matches.

**15. P1 — Prevent the stacks overview from rendering the whole catalog.**

Observed: selecting Curated Stacks shows the four stack cards, followed by the ordinary all-tools grid and its “276 remaining” button. [Candidate selection and rendering](../src/components/ContentSection.tsx) only narrow the list once a stack is selected. Render the stack chooser alone until selection, then show that stack's tools and a clear back action. Search in the overview should search stack descriptions or clearly state that it searches the tool catalog.

**16. P1 — Correct unsupported open-source and platform claims.**

[Platform filtering](../src/lib/platform-tags.ts) treats any GitHub URL as proof of open source. Raycast's organization link is an example of why that is unreliable. The same helper infers free access from a website category or GitHub URL, and some `all` platform tags imply support that has not been independently verified. Model source availability, license, pricing, and supported platforms explicitly, with an unknown state. A public repository alone does not establish an open-source license. Keep source links distinct from product repositories and organization profiles.

**17. P1 — Re-curate stacks to deliver their stated promise.**

Editorial/content finding in [stack data](../src/data/stacks.ts): “Minimalist Mac Powerpack” includes Popcorn Time and PlayCover despite promising lightweight window managers/launchers/utilities. “Web Design & Frontend Studio” includes FMHY, Awesome Swift Apps, and Cobalt. “Local AI & Automation Lab” includes Droppy. Select tools around one concrete workflow, explain each tool's role, list platform constraints and installation links, and remove entries that do not support the stated outcome. Consider a “Save this stack” action with a clear duplicate policy.

**18. P1 — Make comparison intentional and useful on phones.**

Observed: Compare starts with Tabby versus React Bits, simply the catalog's first two entries. Let people choose tools from cards/details, or start with an empty picker and suggested alternatives from the same topic. At 390px the comparison is a tall one-column stack: the observed scrollable content was about 1250px inside a 649px viewport. Use an aligned attribute table or a compact two-tool layout with sticky names and a clear third-tool affordance. Preserve the sourced facts and unknown labels. Evidence: [comparison dialog](../src/components/CompareModal.tsx).

**19. P2 — Broaden and expose verified comparison facts.**

Only four catalog entries currently have [sourced comparison records](../src/data/comparison-details.ts). Most pairings therefore show unknowns. Prioritize popular tools and common alternatives, expose the reviewed facts in tool details as well as Compare, and show an explicit review date. Use descriptive source labels instead of “Source 1.” Keep unknown fields unknown; do not infer price, license, or offline support from a description.

**20. P1 — Repair search relevance before adding more discovery features.**

Observed: searching “screenshot” returned broad image tools such as Lap Photo Manager and image converters ahead of dedicated screenshot utilities. [Topic expansion](../src/lib/search-topics.ts) groups screenshot with the broad image topic; the AI topic list also includes entries such as AltTab and BetterDisplay that deserve editorial review. Give exact task/title matches greater weight than broad topic membership, distinguish related suggestions from direct matches, and add relevance tests with expected leading results. Share the same behavior across catalog search, command palette, and comparison picker.

**21. P1 — Associate form labels and announce status changes.**

Live DOM inspection found zero associated labels on the visible submission fields: labels have no `htmlFor` and controls no corresponding IDs. Add proper associations and persistent names, connect help/error text using `aria-describedby`, mark invalid fields, and use an alert/status region for failure/success. Give the catalog search a persistent accessible name and label the icon-only clear-search and bulk-selection controls. Existing native dialogs and command-palette combobox semantics are good foundations to retain. Evidence: [submission form](../src/app/submit/page.tsx), [catalog](../src/components/ContentSection.tsx).

**22. P1 — Expose selection state and support keyboard orientation.**

Category and platform buttons mostly express selection visually. Use appropriate tab or pressed-button semantics, meaningful groups, and selected state on favorite toggles. Add a skip-to-catalog link, a catalog heading, and consistent visible focus. Increase small close/select/filter controls toward comfortable 44px touch targets; this is a usability target, not a blanket claim that every smaller control violates WCAG. Announce result counts and completed favorites actions without moving focus unexpectedly.

**23. P1 — Honor reduced motion throughout the application.**

Lenis and magnetic interactions have reduced-motion checks, but the loading mascot, roulette sequence, drawer/modal transitions, and tab springs do not share a consistent reduced-motion policy. Configure Framer Motion centrally and provide immediate or minimal transitions for these interactions. Drop automatic roulette cycling when reduced motion is requested. Add a visible way to enter the site while loading; Escape alone is hard to discover and unavailable to a touch-only user.

**24. P1 — Remove the blocking dependency on the startup animation.**

The [homepage layout](../src/components/ClientPageLayout.tsx) server-renders the loader visible and waits for document/fonts/catalog readiness on every mount. Its completion depends on client JavaScript; without hydration, the overlay remains over the prerendered catalog. Use immediately readable server-rendered content, nonblocking loading feedback, or a short optional first-visit intro. A stalled resource should not prevent browsing. Keep the mascot as brand expression without making it a prerequisite for accessing a static directory.

**25. P2 — Improve mobile form ergonomics and honest submission copy.**

Submission inputs compute to 14px; use at least 16px on phones to reduce the risk of iOS focus zoom, and verify with the real keyboard open. Use plain sentence-case field labels and shorter placeholders. Explain that suggestions are sent to Discord for manual review, show the review criteria before submission, and preserve values after errors. “Reviewed within 24h” and “we'll add it shortly” should reflect the actual process rather than promise acceptance or a service level that is not tracked.

**26. P2 — Handle clipboard, storage, and popup failures visibly.**

Copy-link actions immediately show “Copied” without awaiting `navigator.clipboard.writeText`. Await it and offer a selectable-link fallback on failure. Favorites storage failures are only logged; let users know their changes may not persist. Bulk tab opening uses delayed `window.open` calls, which browsers can block and which lack an explicit `noopener` feature. Provide a browser-compatible fallback list, deliberate limits, and useful feedback. Replace generic alerts/confirms with accessible in-page feedback where practical. Harden HTML exports by escaping tags and URL attributes as well as titles/descriptions and validating URL protocols; those fields currently come from repository-controlled catalog data, so this is not a demonstrated imported-file XSS vulnerability.

**27. P2 — Preserve navigation and reading position.**

Every catalog URL update uses `replaceState`; changing tools/categories does not create normal Back navigation. The layout also forces manual scroll restoration and scrolls to the top on mount. Use replace for live typing and push for meaningful category/tool/stack transitions, restore the previous catalog position when returning from submission, and make the home wordmark a link. Avoid forcing returning visitors through the full hero and loader. Evidence: [URL synchronization](../src/components/ContentSection.tsx), [layout](../src/components/ClientPageLayout.tsx).

**28. P1 — Make individual tools and stacks useful search-engine landing pages.**

The sitemap lists `/?tool=...` and category query URLs, but live shared-tool responses have the same title, root canonical, and server-rendered HTML as `/`; the tool dialog appears after hydration. Create static `/tools/[slug]` and `/stacks/[slug]` pages with useful descriptions, sourced facts, related alternatives, distinct metadata, and self-canonicals. Redirect or preserve existing share URLs. Add accurate structured data only for facts actually maintained; do not invent reviews or ratings. Evidence: [sitemap](../src/app/sitemap.ts), [root metadata](../src/app/layout.tsx).

**29. P1 — Give submission its own metadata and correct the sitemap.**

Live `/submit` inherits the homepage title, description, and canonical. Add route-specific metadata and choose intentionally whether to index that utility page. Keep the sitemap focused on canonical pages rather than duplicate query states, and use real content modification dates instead of setting every entry to build time. Maintain one site-origin configuration across sitemap, robots, feeds, and metadata.

**30. P2 — Reduce initial payload and animation infrastructure.**

The live homepage HTML was roughly 385kB uncompressed; the local build compressed to roughly 43kB gzip. One live initial-load sample transferred approximately 260kB of JavaScript and 190kB of font files before later interactions. These are measurements from one browser session, not a Lighthouse score or field Core Web Vitals. Keep the existing static rendering, memoized cards, deferred search, lazy dialogs, and progressive list. Profile the shared studio imports and client catalog serialization, reduce the four font families, and evaluate whether Framer Motion, GSAP, and Lenis are all worth their initial cost. Do not add a database or search service solely for this catalog size.

**31. P2 — Remove third-party logo dependencies from the critical experience.**

Cards render unoptimized images directly from Google favicon services, GitHub, and individual sites. Download or generate permitted small logos at build time, cache them locally with dimensions and a consistent treatment, and provide an error fallback to initials. This improves resilience and reduces visitor requests to unrelated origins. Keep lazy loading below the fold. Inspect actual failed requests before calling an entry broken; an unloaded offscreen lazy image is not a broken image. Evidence: [favicon generation](../src/data/items.ts), [card images](../src/components/DirectoryCard.tsx).

**32. P2 — Make offline behavior explicit and keep caches bounded.**

[The service worker](../public/sw.js) caches visited navigation responses and hashed chunks under a manually versioned cache. Add an eviction/build-retention policy so query variants and old deployment chunks do not accumulate indefinitely. Show an offline indicator and a specific submission-offline message. Test a new deployment with an old tab, first-open lazy dialogs while offline, and uncached `/submit` navigation: the current fallback can return the homepage for a different path. Add proper raster/maskable install icons and an Apple touch icon if installability is a product goal; the manifest currently relies on one SVG icon.

**33. P1 — Resolve known catalog quality problems and make reporting easy.**

The [October 14 link review](catalog-link-review.md) recorded nine 404s and eleven other review cases. These are historical results, not freshly reconfirmed dead links. Triage them, verify product/repository ownership and archived status, and offer “Report a broken or incorrect listing” from details. Separate `addedAt`, `updatedAt`, and `verifiedAt`. Preserve descriptive category names such as “Software” in the UI even if the existing internal value remains `Softwares`.

**34. P2 — Improve editorial consistency and stable identifiers.**

Replace vague superlatives with “what it does,” “who it helps,” and a relevant constraint. Audit “Handpicked daily,” “100% unbiased,” and free-plan claims against an explicit curation policy. Store topics and stable IDs with each record, or in validated maps keyed by stable IDs: IDs currently derive from titles and categories, and topics match titles, so a rename can silently change shares, favorites, dates, comparison facts, and stack references. Add aliases/migrations for existing IDs when changing them.

**35. P1 — Add CI and tests for actual user failures.**

The repository's workflows directory is empty, and the passing tests run in a Node environment. Add CI for clean install, lint, type checking, unit/catalog checks, and build. Add focused route tests for SSRF, rate limiting, payload limits, delivery failure, and duplicate expiry; browser tests for empty-favorites import, filter resets, stack overview, shared details, keyboard dialog flow, and Back behavior. Cover desktop/mobile widths and reduced motion. Schedule link checks separately with manual review of 403/429/timeouts, and add automated dependency updates.

**36. P2 — Add recovery, privacy information, and outcome-oriented monitoring.**

There are no custom error/not-found boundaries. Provide useful recovery actions that return people to search or their previous view. Add concise information explaining local favorites, Discord submission delivery, external favicon requests, and Vercel analytics; make RSS discoverable from the visible footer and replace the framework-version footer text with information useful to visitors. Measure successful discovery, zero-result queries, save actions, and submission failures with minimized data. Query strings can contain user input, so review analytics URL collection and avoid logging raw queries/URLs by default. Pair lab performance checks with field LCP/INP/CLS; installing Speed Insights alone does not establish that targets are met.

**Suggested delivery sequence.** First close the SSRF route and patch dependencies. Next release the search-first desktop/mobile layout together with contrast, form semantics, favorites import, filter-state fixes, and trustworthy source/platform data. Then improve stacks and comparison, add canonical content pages, reduce payload, and strengthen offline/recovery behavior. Put CI around these changes as they land. Measure completion time for finding a suitable tool and returning to saved tools, rather than judging success only by visual polish.
