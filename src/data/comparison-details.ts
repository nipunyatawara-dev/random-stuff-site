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
    pricing: "Free", license: "MIT", accountRequired: "No", offlineSupport: "Partial",
    verifiedAt: "2026-10-14",
    sources: ["https://github.com/Eugeny/tabby", "https://github.com/Eugeny/tabby/blob/master/LICENSE"],
    notes: "Local terminals work offline; SSH, Telnet, and remote connections need a network.",
  },
  "websites-react-bits": {
    pricing: "Free tier", license: "MIT + Commons Clause", accountRequired: "No", offlineSupport: "Partial",
    verifiedAt: "2026-10-14",
    sources: ["https://reactbits.dev/", "https://github.com/DavidHDev/react-bits/blob/main/LICENSE.md"],
    notes: "The public component library is free; Pro is separate. Copied components can run locally, while the documentation site requires internet access.",
  },
  "softwares-gimp": {
    pricing: "Free", license: "GPL-3.0-or-later", accountRequired: "No", offlineSupport: "Yes",
    verifiedAt: "2026-10-14",
    sources: ["https://www.gimp.org/about/", "https://www.gimp.org/docs/userfaq.html", "https://www.gimp.org/docs/"],
    notes: "The installed desktop editor operates on local images without an account.",
  },
  "softwares-raycast": {
    pricing: "Free tier",
    verifiedAt: "2026-10-14",
    sources: ["https://www.raycast.com/pricing"],
    notes: "Core features have a free plan; AI and other Pro features require paid plans. Other comparison fields still need verification.",
  },
};
