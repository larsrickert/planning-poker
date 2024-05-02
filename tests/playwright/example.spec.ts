import { expect, test } from "@nuxt/test-utils/playwright";

test("should show username dialog", async ({ page, goto }) => {
  await goto("/", { waitUntil: "hydration" });

  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await dialog.getByLabel("Username").fill("John Doe");
  await dialog.getByRole("button", { name: "Save" }).click();

  await expect(dialog).toBeHidden();
});
