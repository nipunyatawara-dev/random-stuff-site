import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { createHash } from "node:crypto";
function sources(dir) {
  return readdirSync(dir, { withFileTypes: true })
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((e) =>
      e.isDirectory()
        ? sources(`${dir}/${e.name}`)
        : readFileSync(`${dir}/${e.name}`),
    )
    .flat();
}
const html = readFileSync(".next/server/app/index.html", "utf8");
const assets = [
  ...new Set(
    [
      ...html.matchAll(
        /(?:src|href)="(\/_next\/static\/[^"?]+)(?:\?[^\"]*)?"/g,
      ),
    ].map((m) => m[1]),
  ),
];
// Cache optional dialog chunks too, so their first use works offline. Execution stays lazy.
for (const name of readdirSync(".next/static/chunks")) {
  if (/\.(js|css)$/.test(name)) {
    const url = `/_next/static/chunks/${name}`;
    if (!assets.includes(url)) assets.push(url);
  }
}
if (assets.length > 120)
  throw new Error(
    "Review offline asset budget before precaching more than 120 files.",
  );
const template = readFileSync("src/service-worker.js", "utf8");
const hash = createHash("sha256");
for (const data of sources("src")) hash.update(data);
hash.update(readFileSync("package-lock.json"));
hash.update(assets.join("\n"));
const version = hash.digest("hex").slice(0, 12);
writeFileSync(
  "public/sw.js",
  template
    .replaceAll("__BUILD_VERSION__", version)
    .replace(
      "const BUILD_ASSETS = [];",
      `const BUILD_ASSETS = ${JSON.stringify(assets)};`,
    ),
);
console.log(
  `Offline shell includes ${assets.length} current build assets (${version}).`,
);
