import { test, expect } from '@playwright/test';
test('DFJK scores each lane immediately after starting, including from a focused button', async ({ page }) => {
  await page.clock.install();
  await page.clock.pauseAt(new Date(Date.now() + 1000));
  await page.goto('/');
  await page.getByRole('button', { name: 'Explore Arcade', exact: true }).click();
  await page.getByRole('button', { name: 'Start rhythm session' }).click();
  await expect(page.getByRole('group', { name: 'Rhythm game controls' })).toBeFocused();
  for (const [delay, key, score] of [[2000,'d',100],[500,'f',200],[500,'j',300],[1000,'k',400]] as const) {
    await page.clock.runFor(delay);
    if (key === 'f') await page.getByRole('button', { name: 'Restart session' }).focus();
    await page.keyboard.press(key);
    await expect(page.getByRole('status')).toContainText(`${score} points`);
    await expect(page.locator('.lane-pressed')).toHaveText(key.toUpperCase());
  }
  await page.getByRole('button', { name: 'Restart session' }).click();
  await page.clock.runFor(2000);
  await page.keyboard.press('d');
  await expect(page.getByRole('status')).toContainText('100 points');
  await page.getByRole('button', { name: 'Stop session' }).click();
  await page.keyboard.press('f');
  await expect(page.getByRole('status')).toContainText('Session stopped');
});
