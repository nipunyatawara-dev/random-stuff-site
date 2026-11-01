import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { readCatalog } from "./catalog-data.mjs";
const source = readFileSync(
  new URL("../src/data/items.ts", import.meta.url),
  "utf8",
);
const items = readCatalog(source);
mkdirSync("public/tool-icons", { recursive: true });
const colors = ["#CCE8FF", "#DDF0CC", "#E1E5F0", "#F0E4D8"];
for (const item of items) {
  const initials = item.title
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const index =
    parseInt(
      createHash("sha256").update(item.id).digest("hex").slice(0, 4),
      16,
    ) % colors.length;
  writeFileSync(
    `public/tool-icons/${item.id}.svg`,
    `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="${colors[index]}"/><text x="32" y="41" font-family="Arial,sans-serif" font-size="24" font-weight="700" text-anchor="middle" fill="#14334D">${initials}</text></svg>\n`,
  );
}
const version = createHash("sha256")
  .update(
    source +
      readFileSync("package-lock.json") +
      readFileSync("src/service-worker.js"),
  )
  .digest("hex")
  .slice(0, 12);
writeFileSync(
  "public/sw.js",
  readFileSync("src/service-worker.js", "utf8").replaceAll(
    "__BUILD_VERSION__",
    version,
  ),
);
console.log(
  `Prepared ${items.length} local monograms and versioned offline worker.`,
);
