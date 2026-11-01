import { readFileSync } from "node:fs";
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("search is immediately available and layouts stay inside the viewport", async ({
  page,
}, info) => {
  await page.goto("/");
  const search = page.getByRole("searchbox", {
    name: "Search tools by name, task or tag",
  });
  await expect(search).toBeVisible();
  expect((await search.boundingBox())!.y).toBeLessThan(
    page.viewportSize()!.height,
  );
  await expect(page.locator(".directory-card")).toHaveCount(24);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: `test-results/${info.project.name}-home.png`,
    fullPage: false,
  });
  await page.getByRole("button", { name: "Toggle dark mode" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-color-mode", "dark");
  await page.screenshot({
    path: `test-results/${info.project.name}-dark.png`,
    fullPage: false,
  });
});
test("empty favorites can restore a backup and reject unknown IDs", async ({
  page,
}) => {
  await page.goto("/?category=favorites");
  await expect(page.getByText("Your collection starts here")).toBeVisible();
  await page.getByLabel("Import favorites JSON").setInputFiles({
    name: "backup.json",
    mimeType: "application/json",
    buffer: Buffer.from(
      JSON.stringify({
        itemIds: ["softwares-tabby", "softwares-tabby", "unknown-id"],
      }),
    ),
  });
  await expect(page.locator(".directory-card")).toHaveCount(1);
  await expect(
    page.getByRole("status").filter({ hasText: "1 imported" }),
  ).toContainText("1 unknown, 1 duplicate");
  await page.reload();
  await expect(page.locator(".directory-card")).toHaveCount(1);
});
test("stacks do not leak the whole catalog; filters reset on category changes", async ({
  page,
}) => {
  await page.goto("/?category=stacks");
  await expect(page.locator(".stack-card")).toHaveCount(4);
  await expect(page.locator(".directory-card")).toHaveCount(0);
  await page.getByRole("button", { name: "Explore this kit" }).first().click();
  await expect(page.locator(".directory-card")).toHaveCount(4);
  await page.getByRole("button", { name: "Saved", exact: true }).click();
  await expect(page.getByText("Your collection starts here")).toBeVisible();
  await page.getByRole("button", { name: "All tools", exact: true }).click();
  await page.getByRole("searchbox").fill("screenshot");
  await expect(page.locator(".directory-card").first()).toContainText(
    /Flameshot|WinShot|Shottr|Ksnip|Screendrop|Screenshot/,
  );
  await page.getByRole("button", { name: "Websites", exact: true }).click();
  await expect(page.getByRole("searchbox")).toHaveValue("");
});
test("comparison starts empty and provides a structured table", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Compare", exact: true }).click();
  await expect(
    page.getByRole("dialog", { name: "Compare tools" }),
  ).toBeVisible();
  await expect(page.getByRole("table")).toHaveCount(0);
  await page.getByLabel("Find a tool to compare").fill("Tabby");
  await page.getByRole("button", { name: "Add Tabby", exact: true }).click();
  await expect(page.getByRole("table")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
});
test("quick look supports Back, sources and keyboard close", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Quick look" }).first().click();
  await expect(
    page.getByRole("dialog", { name: "Tabby details" }),
  ).toBeVisible();
  await expect(page.getByText("Not verified", { exact: true })).toHaveCount(0);
  await expect(page).toHaveURL(/tool=softwares-tabby/);
  await page.goBack();
  await expect(page.getByRole("dialog")).toHaveCount(0);
});
test("static tool pages have unique metadata and work without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/tools/softwares-tabby");
  await expect(
    page.getByRole("heading", { name: "Tabby", exact: true }),
  ).toBeVisible();
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    /\/tools\/softwares-tabby$/,
  );
  await expect(page).toHaveTitle(/Tabby/);
  await context.close();
});
test("submission has associated labels and preserves input on failure", async ({
  page,
}) => {
  await page.route("**/api/submit", (route) =>
    route.request().method() === "GET"
      ? route.fulfill({ json: { available: true } })
      : route.fulfill({
          status: 502,
          json: { error: "Delivery failed. Please retry." },
        }),
  );
  await page.goto("/submit");
  await page
    .getByLabel("Tool name (required)", { exact: true })
    .fill("Audit fixture");
  await page
    .getByLabel("Official website or repository (required)")
    .fill("https://example.com");
  await page
    .getByLabel("What makes it useful? (required)")
    .fill("A useful test fixture.");
  await page.getByRole("button", { name: "Send for review" }).click();
  await expect(page.locator("#submission-error")).toContainText(
    "Delivery failed",
  );
  await expect(
    page.getByLabel("Tool name (required)", { exact: true }),
  ).toHaveValue("Audit fixture");
});
test("public pages pass accessibility scans in both color modes", async ({
  page,
}, info) => {
  for (const path of [
    "/",
    "/submit",
    "/tools/softwares-tabby",
    "/stacks/mac-powerpack",
    "/about",
  ]) {
    await page.goto(path);
    for (const mode of ["light", "dark"]) {
      await page.evaluate((m) => {
        document.documentElement.dataset.colorMode = m;
      }, mode);
      await page.screenshot({
        path: `test-results/${info.project.name}-${path.replaceAll("/", "_") || "home"}-${mode}.png`,
        fullPage: false,
      });
      const result = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      expect(
        result.violations.map((v) => ({
          id: v.id,
          nodes: v.nodes.map((n) => n.target),
        })),
      ).toEqual([]);
    }
  }
});
test("metadata proxy is gone and security headers are present", async ({
  request,
}) => {
  expect(
    (await request.get("/api/metadata?url=http://127.0.0.1")).status(),
  ).toBe(404);
  const response = await request.get("/");
  expect(response.headers()["content-security-policy"]).toContain(
    "object-src 'none'",
  );
  expect(response.headers()["content-security-policy-report-only"]).toContain(
    "script-src 'self'",
  );
});
test("header navigation applies collection links from the same page", async ({
  page,
}) => {
  await page.goto("/");
  if (page.viewportSize()!.width <= 700)
    await page.getByText("Menu", { exact: true }).click();
  await page
    .getByRole("link", {
      name: page.viewportSize()!.width <= 700 ? "Saved tools" : "Saved tools",
      exact: true,
    })
    .first()
    .click();
  await expect(page.getByText("Your collection starts here")).toBeVisible();
});
test("offline reload hydrates the catalog and uncached routes show an offline page", async ({
  page,
  context,
}) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "Save Tabby to favorites", exact: true })
    .click();
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
    if (!navigator.serviceWorker.controller)
      await new Promise<void>((resolve) =>
        navigator.serviceWorker.addEventListener(
          "controllerchange",
          () => resolve(),
          { once: true },
        ),
      );
  });
  await context.setOffline(true);
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: /^Saved/ }).click();
  await expect(page.locator(".directory-card")).toHaveCount(1);
  await expect(page.locator(".directory-card")).toContainText("Tabby");
  await page.getByRole("button", {name:"Compare", exact:true}).click();
  await expect(page.getByRole("dialog",{name:"Compare tools"})).toBeVisible();
  await page.keyboard.press("Escape");
  await page.keyboard.press("Control+k");
  await expect(page.getByRole("combobox",{name:"Search tools and commands"})).toBeVisible();
  await page.keyboard.press("Escape");
  await page.goto("/submit", { waitUntil: "domcontentloaded" });
  await expect(
    page.getByRole("heading", { name: "You are offline." }),
  ).toBeVisible();
  await context.setOffline(false);
});

test("plain-text export includes every favorite even when filtered and selected", async ({page}) => {
  await page.addInitScript(() => {
    localStorage.setItem("random-stuff-favorites", JSON.stringify(["softwares-tabby", "softwares-raycast"]));
  });
  await page.goto("/?category=favorites&q=tabby");
  await expect(page.locator(".directory-card")).toHaveCount(1);
  await page.getByRole("button", {name:"Select tools", exact:true}).click();
  await page.getByRole("button", {name:"Select Tabby", exact:true}).click();
  await page.getByText("Export all favorites", {exact:true}).click();
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", {name:"Plain text (.txt)", exact:true}).click(),
  ]);
  expect(download.suggestedFilename()).toBe("random-stuff-favorites.txt");
  const text=readFileSync((await download.path())!, "utf8");
  expect(text).toBe([
    "Tabby",
    "A terminal for a more modern age.",
    "https://tabby.sh",
    "https://github.com/Eugeny/tabby",
    "",
    "Raycast",
    "The best launcher for macOS. Replaces Spotlight.",
    "https://raycast.com",
    "https://github.com/raycast",
    "",
  ].join("\n"));
});
