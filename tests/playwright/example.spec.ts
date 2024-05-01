import { expect, test } from "@nuxt/test-utils/playwright";

test("example Playwright test", async ({ page, goto }) => {
  await goto("/", { waitUntil: "hydration" });
  await expect(page.getByRole("heading", { name: "GitHub planning poker" })).toBeVisible();
});
