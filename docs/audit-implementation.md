# Audit implementation — November 1, 2026

The audit's recommendations have been applied to the codebase. The production site has not been deployed or modified remotely. The deployment-dependent items below remain explicit.

| Audit items | Implementation |
| --- | --- |
| 1 | Removed `/api/metadata` and its HTML parsing dependency. The arbitrary outbound fetch/SSRF path no longer exists. |
| 2 | Updated Next.js/config to 16.4.3, React/DOM to 19.3.1 and test/tool dependencies. Legacy lint plugins use a tested CommonJS adapter around the patched minimatch 11 engine; no parser is forked or node_modules patched. Both runtime and complete dependency audits are clean. |
| 3–4 | Atomic shared Redis limits and duplicate reservations, correct 24-hour expiry, bounded local counters, trusted-host identity handling, payload bounds, deadlines, origin/content-type checks, upstream timeout/error handling and delivery receipts. The existing Discord webhook is sufficient; Redis is optional for counters shared across instances. |
| 5 | Local-only images; enforced origin/object/frame/form/base policy and a stricter script policy in report-only mode. Static Next bootstrap still requires inline scripts in the enforced policy. |
| 6–11 | Search-first desktop/mobile composition, one self-hosted font, readable text/contrast, calmer card styling, a real featured workflow link, visible mobile categories and expandable combined filters. Otter and blue/navy/lime identity retained. |
| 12–15 | Import available in empty collections; IDs/files validated and deduplicated; truthful counts and empty states; resettable filters; stacks overview no longer includes the full catalog. |
| 16–20 | No GitHub-based license/free inference or `all`-platform inference. Re-curated workflows with tool roles, opt-in comparison, aligned attribute table, facts exposed on details pages, extra sourced records and more precise screenshot/AI search relevance. |
| 21–25 | Associated form labels/help, live error/status feedback, keyboard/native-dialog behavior, pressed states, skip link, comfortable targets, 16px mobile fields, reduced motion and no blocking loader. Submission text no longer promises a review deadline or acceptance. |
| 26–27 | Clipboard fallback, visible storage failure feedback, safe individual links for bulk opening, explicit deletion confirmation, meaningful browser history and native scroll restoration. |
| 28–29 | 312 static tool pages, four workflow pages and a complete text index; unique metadata/canonicals, truthful structured data, canonical sitemap and real content dates; submission-specific metadata/noindex. Existing share URLs retained. |
| 30–32 | Removed GSAP, Lenis, page-view analytics and four-font overhead; optional dialogs stay lazy. Generated local icons, versioned bounded offline caches, initial shell-asset precaching, explicit offline page, raster install/maskable icons and touch icon. |
| 33–34 | Active broken URLs corrected against official sources; an unavailable listing is visibly disabled rather than pointed to a guessed replacement. Stable IDs/dates/topics are now persisted. Link review refreshed and available from maintenance docs. |
| 35–36 | CI for lint/unit/build/type/dependency/browser checks, weekly link review and dependency updates; error/not-found recovery, curation/privacy page, visible RSS, and performance URL redaction. |

Validation is recorded in the final handoff. Unit tests cover rate limits, duplicate expiry, confirmed/failed/ambiguous delivery, payload/protocol checks, import validation, export escaping, search relevance, stable IDs, cache bounds and offline fallbacks. Browser regressions cover 320/390/768/1440px layouts, both themes, accessibility scans, favorites restoration, filtering, comparison, keyboard/Back behavior, static detail pages and form failure recovery. They mock suggestion delivery; no real Discord message was sent.

The full active-link review checked 481 URLs: 469 responded successfully, zero returned 404/410, and twelve need manual review for blocking, rate limiting, legal restrictions or network errors. Net-Bar's launch destination is disabled until a replacement is verified. See `catalog-link-review.md` for evidence and details.

Before production release, retain the existing Discord webhook and verify the deployment’s actual headers and delivery path. No hosted Redis account was provisioned and no credentials were supplied during implementation. The form works with the webhook alone and bounded per-instance spam checks. Redis can optionally share counters across instances; without it, counts reset on restart. A configured-but-unreachable Redis store returns an error, and the issue-link alternative remains available for delivery failures. A guaranteed-delivery outbox and external discovery analytics were not introduced; current delivery semantics and privacy-conscious performance diagnostics are documented in `deployment.md`.

The strict report-only script policy must not be enforced unchanged: it would block Next's static hydration scripts. A future fully strict script CSP needs a tested hash integration or request nonces and the corresponding rendering tradeoff. The other CSP directives are enforced now.

Real-device Safari/Android behavior and field performance need a deployed build. The local responsive browser checks establish layout and interaction behavior, not field Core Web Vitals or a production penetration test.

Final local verification: clean `npm ci`; lint; the complete unit test suite; production build; TypeScript; 48 passing browser tests across four widths; accessibility scans of the homepage, submission, tool, stack and about pages in both themes; offline reload including first-use comparison/command dialogs; and zero findings from the complete dependency audit. The offline worker precaches the current compiled browser assets, including lazy dialog chunks and self-hosted fonts. Screenshot review included desktop/mobile homepage, submission, tool and stack views. Generated screenshots and traces are kept in ignored `test-results/`.

Favorites now offer a plain-text download containing every saved tool’s name, simple description and related links only, including when the current view is filtered or items are selected. Desktop and mobile browser tests verify the downloaded content.

Vercel build correction: offline generation runs in `compiler.runAfterProductionCompile`, before adapter packaging, without reading prerendered HTML. Node is pinned to 24.x. Regression tests cover pre-render timing, packaged worker content, nested/lazy chunks and fonts, asset version changes, missing chunks and cache budget enforcement.
