import { expect, test } from "@nuxt/test-utils/playwright";

// TODO: skip test for now since some dependencies seem to have issues
test.skip("should show username dialog", async ({ page, goto }) => {
  await goto("/", { waitUntil: "hydration" });

  const dialog = page.getByRole("alertdialog", { name: "Set username" });
  await expect(dialog).toBeVisible();
  await dialog.getByLabel("Username").fill("John Doe");
  await dialog.getByRole("button", { name: "Save" }).click();

  await expect(dialog).toBeHidden();
});
