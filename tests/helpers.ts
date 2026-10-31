import { expect, type Page } from '@playwright/test';

// Opening a World.exe level takes two clicks: the first walks the character there along the
// road, the second (once standing on it) opens it. A level the character already stands on
// opens on the first click.
export async function openRoom(page: Page, label: string) {
  const button = page.getByRole('button', { name: `Explore ${label}`, exact: true });
  await button.click();
  if (await page.locator('dialog[open]').count()) return;
  await expect(button).toHaveAttribute('data-here', 'true', { timeout: 10000 });
  await button.click();
  await expect(page.locator('dialog[open]')).toHaveCount(1);
}
