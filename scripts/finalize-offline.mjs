import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";

function files(dir) {
  return readdirSync(dir, { withFileTypes: true })
    .sort((a, b) => a.name.localeCompare(b.name))
    .flatMap((entry) =>
      entry.isDirectory()
        ? files(join(dir, entry.name)).map((name) => `${entry.name}/${name}`)
        : [entry.name],
    );
}

/**
 * Run after compilation, before the deployment adapter copies public files or
 * relocates build outputs. Prerendered HTML does not exist at this point.
 * @param {{ projectDir: string, distDir: string }} metadata
 */
export function finalizeOffline({ projectDir, distDir }) {
  const staticDir = join(distDir, "static");
  // Include lazy dialogs and nested chunks, plus self-hosted fonts. Do not
  // depend on internal HTML paths or manifests written later in the build.
  const assets = files(staticDir)
    .filter((name) =>
      /^(?:immutable\/)?(?:chunks\/.*\.(?:js|css)|media\/.*\.(?:woff2?|ttf|otf))$/.test(name),
    )
    .map((name) => `/_next/static/${name}`);
  if (!assets.some((url) => url.endsWith(".js")))
    throw new Error("No compiled browser chunks found for the offline shell.");
  if (assets.length > 120)
    throw new Error(
      "Review offline asset budget before precaching more than 120 files.",
    );

  const srcDir = join(projectDir, "src");
  const template = readFileSync(join(srcDir, "service-worker.js"), "utf8");
  const hash = createHash("sha256");
  for (const name of files(srcDir)) hash.update(readFileSync(join(srcDir, name)));
  hash.update(readFileSync(join(projectDir, "package-lock.json")));
  hash.update(assets.join("\n"));
  const version = hash.digest("hex").slice(0, 12);
  writeFileSync(
    join(projectDir, "public/sw.js"),
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
}
