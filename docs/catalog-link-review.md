# Catalog link review

Checked 2026-11-01T07:13:59.767Z. 469 active URLs responded, 0 returned HTTP 404/410, and 12 need manual review.

Confirmed broken destinations were corrected against official sources. Net-Bar has no verified working replacement, so external launch links are disabled while its stable listing is preserved. GitHub Store was renamed to Komi Store with its existing ID retained. OmniGet now links to its official author site; the inaccessible repository was removed. Other corrected destinations: Actiona, GSmartControl, Thunderbird, Nora and Cline.

Official evidence: [Komi repository](https://github.com/komi-store/komi-store), [GSmartControl repository](https://github.com/ashaduri/gsmartcontrol), [Actiona repository](https://github.com/Jmgr/actiona), [Nora repository](https://github.com/Sandakan/Nora), [OmniGet security page](https://getomniget.com/security), [Cline installation](https://cline.bot/install), [Thunderbird development](https://developer.thunderbird.net/thunderbird-development/setting-up-a-build-environment).

The remaining cases are not treated as dead tools: anti-bot responses, legal restrictions, rate limits and network errors need a human review. The checker runs weekly in CI and writes an artifact.

| Tools | Result | URL |
| --- | --- | --- |
| Deck.Gallery | HTTP 403 | https://deck.gallery/ |
| Dither | fetch failed | https://dither.fun/ |
| Paperless-ngx | HTTP 403 | https://docs.paperless-ngx.com |
| FFmpeg conversion guide | fetch failed | https://ffmpeg.org/ffmpeg.html |
| Droppy | HTTP 451 | https://github.com/iordv/Droppy |
| Inkscape | The operation was aborted due to timeout | https://inkscape.org |
| QuillBot | HTTP 403 | https://quillbot.com |
| Simple Icons | fetch failed | https://simple-icons.org |
| Vocal Remover | HTTP 403 | https://vocalremover.org |
| emailcn | HTTP 503 | https://www.emailcn.run |
| Printed Matter | HTTP 403 | https://www.printedmatter.org/ |
| SVG Repo | HTTP 429 | https://www.svgrepo.com |
