import { readFileSync } from "node:fs";
import { test, expect, type Page } from "@playwright/test";

// External icon availability is independent of the restored layout and interactions.
test.beforeEach(async ({ page }) => {
  await page.route("**/*", (route) =>
    route.request().resourceType() === "image" && !route.request().url().startsWith("http://127.0.0.1:3100/")
      ? route.abort()
      : route.continue(),
  );
});

async function directory(page: Page, path = "/") {
  await page.goto(path, { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("searchbox", { name: "Search tools by name, task or tag" })).toBeVisible();
  await expect(page.locator('[aria-label="Loading site"]')).toHaveCount(0, { timeout: 15000 });
}

test("original typography, hero, cards and responsive layout are restored", async ({ page }, info) => {
  await directory(page);
  await expect(page.locator(".directory-card")).toHaveCount(36);
  await expect(page.locator(".font-phudu").first()).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: `test-results/${info.project.name}-restored-home.png` });
  await page.evaluate(() => { document.documentElement.dataset.colorMode = "dark"; });
  await page.screenshot({ path: `test-results/${info.project.name}-restored-dark.png` });
});

test("search and original quick-look dialog work", async ({ page }) => {
  await directory(page);
  await page.getByRole("searchbox").fill("Tabby");
  await expect(page.locator(".directory-card")).toHaveCount(1);
  await page.getByRole("button", { name: "View details for Tabby" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog", { name: "Tabby details" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("plain-text export retains all favorites under the original export menu", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("random-stuff-favorites", JSON.stringify(["softwares-tabby", "softwares-raycast"])));
  await directory(page, "/?category=favorites&q=tabby");
  await expect(page.locator(".directory-card")).toHaveCount(1);
  await page.getByRole("button", { name: "Export / Import", exact: true }).click();
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: "Export as plain text (.txt)", exact: true }).click(),
  ]);
  expect(download.suggestedFilename()).toBe("random-stuff-favorites.txt");
  expect(readFileSync((await download.path())!, "utf8")).toBe([
    "Tabby", "A terminal for a more modern age.", "https://tabby.sh", "https://github.com/Eugeny/tabby", "",
    "Raycast", "The best launcher for macOS. Replaces Spotlight.", "https://raycast.com", "https://github.com/raycast", "",
  ].join("\n"));
});

test("favorites import remains available when empty", async ({ page }) => {
  await directory(page, "/?category=favorites");
  await page.getByRole("button", { name: "Export / Import", exact: true }).click();
  page.once("dialog", (dialog) => dialog.accept());
  await page.locator('input[type="file"]').setInputFiles({ name: "favorites.json", mimeType: "application/json", buffer: Buffer.from(JSON.stringify(["softwares-tabby", "unknown"])) });
  await expect(page.locator(".directory-card")).toHaveCount(1);
  await expect(page.locator(".directory-card")).toContainText("Tabby");
});

test("original submission layout preserves labels and entered fields on delivery failure", async ({ page }, info) => {
  await page.route("**/api/submit", (route) => route.fulfill({ status: 502, json: { error: "Delivery failed. Please retry." } }));
  await page.goto("/submit", { waitUntil: "domcontentloaded" });
  await page.getByLabel("Tool Name").fill("Test fixture");
  await page.getByLabel("Website or GitHub URL").fill("https://example.com");
  await page.getByLabel("Brief Description").fill("A useful test fixture.");
  await page.getByRole("button", { name: "Submit Tool for Review" }).click();
  await expect(page.locator("main [role=alert]")).toContainText("Delivery failed");
  await expect(page.getByLabel("Tool Name")).toHaveValue("Test fixture");
  await page.screenshot({ path: `test-results/${info.project.name}-restored-submit.png` });
});

test("static tool pages retain metadata without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/tools/softwares-tabby", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: "Tabby", exact: true })).toBeVisible();
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/tools\/softwares-tabby$/);
  await expect(page).toHaveTitle(/Tabby/);
  await context.close();
});

test("metadata proxy remains removed and security headers remain enforced", async ({ request }) => {
  expect((await request.get("/api/metadata?url=http://127.0.0.1")).status()).toBe(404);
  const response = await request.get("/");
  expect(response.headers()["content-security-policy"]).toContain("object-src 'none'");
  expect(response.headers()["content-security-policy-report-only"]).toContain("script-src 'self'");
});

test("offline reload and first-use dialogs still work with the original interface", async ({ page, context }) => {
  await directory(page);
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
    if (!navigator.serviceWorker.controller) await new Promise<void>((resolve) => navigator.serviceWorker.addEventListener("controllerchange", () => resolve(), { once: true }));
  });
  await context.setOffline(true);
  await directory(page);
  await page.keyboard.press("Control+k");
  await expect(page.getByRole("dialog", { name: "Command Palette" })).toBeVisible();
  await page.keyboard.press("Escape");
  await page.goto("/submit", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: "You are offline." })).toBeVisible();
  await context.setOffline(false);
});
