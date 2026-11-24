import { expect, type Page } from '@playwright/test';

// Opening a World.exe level: clicking a level shows it in the panel beside the wheel. A level that is
// not at the front turns to the front first and then opens by itself. It may be round the back of the
// ring, out of sight, so it is clicked programmatically, as a screen reader would.
export async function openRoom(page: Page, label: string) {
  // By CSS rather than role: a level round the back of the ring is hidden, so it is out of the accessibility tree.
  const button = page.locator(`.dial-item[aria-label="Explore ${label}"]`);
  const panel = page.locator('.dial-panel');
  if ((await button.getAttribute('data-here')) === 'true' && await panel.isVisible()) return;
  // Line the section up under the header first, as a visitor looking at the wheel would have it,
  // so the page does not glide into place while the test is checking the panel.
  await page.locator('.dial-sticky').evaluate(el => {
    const header = (document.querySelector('.site-header') as HTMLElement | null)?.offsetHeight ?? 80;
    window.scrollTo(0, window.scrollY + el.getBoundingClientRect().top - header);
  });
  await page.waitForTimeout(100);
  await button.dispatchEvent('click');
  await expect(button).toHaveAttribute('data-here', 'true', { timeout: 10000 });
  await expect(panel).toBeVisible({ timeout: 10000 });
}
