import { test, expect } from '@playwright/test';
test('DFJK judges each lane on time, builds a combo, and can be stopped', async ({ page }) => {
  await page.clock.install();
  await page.clock.pauseAt(new Date(Date.now() + 1000));
  await page.goto('/');
  // The page clock is frozen, so let the character walk to the Arcade before entering it.
  const arcade = page.getByRole('button', { name: 'Explore Arcade', exact: true });
  await arcade.click();
  await page.clock.runFor(5000);
  await arcade.click();
  await page.getByRole('button', { name: 'Start rhythm session' }).click();
  await expect(page.getByRole('group', { name: 'Rhythm game controls' })).toBeFocused();
  const status = page.locator('.rhythm [role=status]');
  // The first four notes: D, F, J, K, half a second apart from 2 s.
  for (const [delay, key, combo] of [[2000, 'd', 1], [500, 'f', 2], [500, 'j', 3], [500, 'k', 4]] as const) {
    await page.clock.runFor(delay);
    if (key === 'f') await page.getByRole('button', { name: 'Restart session' }).focus();
    await page.keyboard.press(key);
    await expect(status).toContainText(`${combo} combo · Perfect`);
    await expect(page.locator('.lane-pressed')).toHaveText(key.toUpperCase());
  }
  await page.getByRole('button', { name: 'Restart session' }).click();
  await page.clock.runFor(2000);
  await page.keyboard.press('d');
  await expect(status).toContainText('1 combo');
  await page.getByRole('button', { name: 'Stop session' }).click();
  await page.keyboard.press('f');
  await expect(status).toContainText('Session stopped');
});
