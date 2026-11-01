import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { finalizeOffline } from "../../scripts/finalize-offline.mjs";
import nextConfig from "../../next.config";

const projects: string[] = [];
afterEach(() => {
  for (const project of projects.splice(0)) rmSync(project, { recursive: true, force: true });
  vi.restoreAllMocks();
});

function fixture() {
  const projectDir = mkdtempSync(join(tmpdir(), "offline-build-"));
  projects.push(projectDir);
  const distDir = join(projectDir, "custom-build");
  function write(name: string, content = "fixture") {
    const path = join(projectDir, name);
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, content);
  }
  write("src/service-worker.js", 'const VERSION = "__BUILD_VERSION__";\nconst BUILD_ASSETS = [];');
  write("package-lock.json", "{}");
  write("public/sw.js", "old worker");
  write("custom-build/static/chunks/app.js");
  vi.spyOn(console, "log").mockImplementation(() => {});
  return { projectDir, distDir, write, worker: () => readFileSync(join(projectDir, "public/sw.js"), "utf8") };
}

describe("offline build lifecycle", () => {
  it("finalizes the worker before an adapter packages public files, without prerendered HTML", async () => {
    const project = fixture();
    project.write("custom-build/static/chunks/nested/dialog.js");
    project.write("custom-build/static/chunks/style.css");
    project.write("custom-build/static/media/font.woff2");
    project.write("custom-build/static/immutable/chunks/vercel.js");
    project.write("custom-build/static/immutable/media/vercel.woff2");
    project.write("custom-build/static/chunks/app.js.map");
    project.write("custom-build/static/media/icon.png");
    await nextConfig.compiler!.runAfterProductionCompile!(project);
    // Model the adapter copying the worker after the compiler hook finishes.
    project.write("custom-build/output/static/sw.js", project.worker());
    const worker = readFileSync(join(project.distDir, "output/static/sw.js"), "utf8");
    expect(worker).toContain("/_next/static/chunks/app.js");
    expect(worker).toContain("/_next/static/chunks/nested/dialog.js");
    expect(worker).toContain("/_next/static/chunks/style.css");
    expect(worker).toContain("/_next/static/media/font.woff2");
    expect(worker).toContain("/_next/static/immutable/chunks/vercel.js");
    expect(worker).toContain("/_next/static/immutable/media/vercel.woff2");
    expect(worker).not.toContain(".map");
    expect(worker).not.toContain("icon.png");
    expect(worker).not.toContain("__BUILD_VERSION__");
  });

  it("changes the worker version when deployed asset names change", () => {
    const project = fixture();
    finalizeOffline(project);
    const original = project.worker();
    project.write("custom-build/static/chunks/new-hash.js");
    finalizeOffline(project);
    expect(project.worker().split("\n")[0]).not.toBe(original.split("\n")[0]);
  });

  it("fails without usable browser chunks instead of publishing a broken offline shell", () => {
    const project = fixture();
    rmSync(join(project.distDir, "static/chunks/app.js"));
    expect(() => finalizeOffline(project)).toThrow("No compiled browser chunks");
    expect(project.worker()).toBe("old worker");
  });

  it("preserves the precache budget", () => {
    const project = fixture();
    for (let i = 0; i < 120; i++) project.write(`custom-build/static/chunks/${i}.js`);
    expect(() => finalizeOffline(project)).toThrow("offline asset budget");
    expect(project.worker()).toBe("old worker");
  });
});
