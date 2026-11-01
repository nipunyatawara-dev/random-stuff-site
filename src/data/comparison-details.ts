export interface ComparisonDetails {
  pricing?: "Free" | "Free tier" | "Paid";
  license?: string;
  accountRequired?: "Yes" | "No" | "Optional";
  offlineSupport?: "Yes" | "Partial" | "No";
  verifiedAt: string;
  sources: string[];
  notes?: string;
}

// Only sourced facts belong here. Omitted fields display as "Not verified".
// Verification date refers to this review, not the tool's release date.
export const COMPARISON_DETAILS: Record<string, ComparisonDetails> = {
  "softwares-tabby": {
    pricing: "Free",
    license: "MIT",
    accountRequired: "No",
    offlineSupport: "Partial",
    verifiedAt: "2026-10-14",
    sources: [
      "https://github.com/Eugeny/tabby",
      "https://github.com/Eugeny/tabby/blob/master/LICENSE",
    ],
    notes:
      "Local terminals work offline; SSH, Telnet, and remote connections need a network.",
  },
  "websites-react-bits": {
    pricing: "Free tier",
    license: "MIT + Commons Clause",
    accountRequired: "No",
    offlineSupport: "Partial",
    verifiedAt: "2026-10-14",
    sources: [
      "https://reactbits.dev/",
      "https://github.com/DavidHDev/react-bits/blob/main/LICENSE.md",
    ],
    notes:
      "The public component library is free; Pro is separate. Copied components can run locally, while the documentation site requires internet access.",
  },
  "softwares-gimp": {
    pricing: "Free",
    license: "GPL-3.0-or-later",
    accountRequired: "No",
    offlineSupport: "Yes",
    verifiedAt: "2026-10-14",
    sources: [
      "https://www.gimp.org/about/",
      "https://www.gimp.org/docs/userfaq.html",
      "https://www.gimp.org/docs/",
    ],
    notes:
      "The installed desktop editor operates on local images without an account.",
  },
  "softwares-raycast": {
    pricing: "Free tier",
    verifiedAt: "2026-10-14",
    sources: ["https://www.raycast.com/pricing"],
    notes:
      "Core features have a free plan; AI and other Pro features require paid plans. Other comparison fields still need verification.",
  },
  "softwares-flameshot": {
    pricing: "Free",
    license: "GPL-3.0",
    verifiedAt: "2026-11-01",
    sources: [
      "https://github.com/flameshot-org/flameshot",
      "https://github.com/flameshot-org/flameshot/blob/master/LICENSE",
    ],
    notes:
      "Screenshot capture and annotation. Third-party components may have additional license terms; check platform installation instructions.",
  },
  "softwares-obs-studio": {
    pricing: "Free",
    license: "GPL-2.0",
    verifiedAt: "2026-11-01",
    sources: [
      "https://obsproject.com/help",
      "https://github.com/obsproject/obs-studio/blob/master/COPYING",
    ],
    notes:
      "Recording and live-streaming software. Streaming and online services require network access; plugin terms can differ.",
  },
  "softwares-omniget": {
    pricing: "Free",
    license: "GPL-3.0",
    verifiedAt: "2026-11-01",
    sources: [
      "https://getomniget.com/about",
      "https://getomniget.com/security",
    ],
    notes:
      "The author's site describes GPL-3.0 licensing. The former public repository returned 404 during review; use the official site for current downloads.",
  },
};
